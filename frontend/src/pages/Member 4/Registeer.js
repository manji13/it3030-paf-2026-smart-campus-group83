import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const navigate = useNavigate();

    // Page entrance animation
    useEffect(() => {
        setPageLoaded(true);
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDarkMode(true);
        }
    }, []);

    // Toggle theme
    const toggleTheme = () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    };

    // Get theme classes
    const getThemeClasses = () => {
        return isDarkMode
            ? 'bg-gray-900 text-white'
            : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-gray-900';
    };

    const getCardClasses = () => {
        return isDarkMode
            ? 'bg-gray-800/90 border-gray-700'
            : 'bg-white/90 border-white/30';
    };

    const getInputClasses = () => {
        return isDarkMode
            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500'
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500';
    };

    // Validation functions
    const validateName = (name) => {
        if (!name) return 'Full name is required';
        if (name.length < 2) return 'Name must be at least 2 characters';
        if (!/^[a-zA-Z\s\-']+$/.test(name)) return 'Name can only contain letters, spaces, hyphens, and apostrophes';
        return '';
    };

    const validateEmail = (email) => {
        if (!email) return 'Email address is required';
        const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        if (!emailRegex.test(email)) return 'Please enter a valid email address';
        return '';
    };

    const validatePassword = (password) => {
        if (!password) return 'Password is required';
        if (password.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
        if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter';
        if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
        if (!/(?=.*[@$!%*?&])/.test(password)) return 'Password must contain at least one special character (@$!%*?&)';
        return '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        let error = '';
        
        switch (name) {
            case 'name':
                error = validateName(value);
                break;
            case 'email':
                error = validateEmail(value);
                break;
            case 'password':
                error = validatePassword(value);
                break;
            default:
                break;
        }
        
        if (error) {
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const nameError = validateName(formData.name);
        const emailError = validateEmail(formData.email);
        const passwordError = validatePassword(formData.password);
        
        const newErrors = {};
        if (nameError) newErrors.name = nameError;
        if (emailError) newErrors.email = emailError;
        if (passwordError) newErrors.password = passwordError;
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        setIsLoading(true);
        
        try {
            // The backend uses an upsert mock-login pattern:
            // POSTing name + email creates the account if new, or logs in if existing.
            const response = await axios.post('http://localhost:8000/api/v1/auth/google/mock', {
                name: formData.name,
                email: formData.email,
            });
            const authData = response.data?.data || response.data;
            // Store user info so Login page and rest of app can read it
            localStorage.setItem('user', JSON.stringify({
                token: authData.token,
                userId: authData.userId,
                email: authData.email,
                name: authData.name,
                pictureUrl: authData.pictureUrl,
                role: authData.roles ? [...authData.roles][0] : 'USER',
            }));
            setIsLoading(false);
            setShowSuccessModal(true);
        } catch (error) {
            setIsLoading(false);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || "Error registering user. Please try again.";
            alert(errorMessage);
        }
    };

    const handleModalClose = () => {
        setShowSuccessModal(false);
        setTimeout(() => {
            navigate('/login');
        }, 300);
    };

    const getPasswordStrength = () => {
        const password = formData.password;
        if (!password) return { score: 0, label: '', color: '', barColor: '' };
        
        let score = 0;
        if (password.length >= 8) score++;
        if (/(?=.*[a-z])/.test(password)) score++;
        if (/(?=.*[A-Z])/.test(password)) score++;
        if (/(?=.*\d)/.test(password)) score++;
        if (/(?=.*[@$!%*?&])/.test(password)) score++;
        
        if (score <= 2) return { score, label: 'Weak', textColor: 'text-red-500', barColor: 'bg-red-500' };
        if (score <= 3) return { score, label: 'Fair', textColor: 'text-yellow-500', barColor: 'bg-yellow-500' };
        if (score <= 4) return { score, label: 'Good', textColor: 'text-blue-500', barColor: 'bg-blue-500' };
        return { score, label: 'Strong', textColor: 'text-green-500', barColor: 'bg-green-500' };
    };

    const passwordStrength = getPasswordStrength();

    return (
        <div className={`min-h-screen flex items-center justify-center ${getThemeClasses()} py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden transition-all duration-500 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse ${isDarkMode ? 'bg-purple-900' : 'bg-purple-200'}`}></div>
                <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000 ${isDarkMode ? 'bg-indigo-900' : 'bg-indigo-200'}`}></div>
                <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-2000 ${isDarkMode ? 'bg-pink-900' : 'bg-pink-200'}`}></div>
            </div>

            {/* Theme Toggle Button */}
            <button
                onClick={toggleTheme}
                className={`fixed top-4 right-4 z-50 p-2 rounded-lg transition-all duration-200 cursor-pointer ${isDarkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
                {isDarkMode ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                )}
            </button>

            <div className="max-w-md w-full z-10 transform transition-all duration-500 translate-y-0 opacity-100">
                {/* Card */}
                <div className={`${getCardClasses()} backdrop-blur-md p-8 rounded-2xl shadow-2xl border transition-all duration-300 hover:shadow-3xl`}>
                    
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="mx-auto h-16 w-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg animate-bounce">
                            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Create an account
                        </h2>
                        <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Join our community. It only takes a minute.
                        </p>
                    </div>

                    {/* Form */}
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        
                        {/* Name Input */}
                        <div className="transform transition-all duration-300 hover:translate-x-1">
                            <label htmlFor="name" className={`block text-sm font-semibold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    className={`appearance-none block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 sm:text-sm cursor-text ${getInputClasses()} ${
                                        errors.name 
                                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                                            : isDarkMode ? 'border-gray-600 focus:border-indigo-500 focus:ring-indigo-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
                                    }`}
                                />
                            </div>
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-500 flex items-center gap-1 animate-pulse">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Email Input */}
                        <div className="transform transition-all duration-300 hover:translate-x-1">
                            <label htmlFor="email" className={`block text-sm font-semibold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    className={`appearance-none block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 sm:text-sm cursor-text ${getInputClasses()} ${
                                        errors.email 
                                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                                            : isDarkMode ? 'border-gray-600 focus:border-indigo-500 focus:ring-indigo-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
                                    }`}
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500 flex items-center gap-1 animate-pulse">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Input */}
                        <div className="transform transition-all duration-300 hover:translate-x-1">
                            <label htmlFor="password" className={`block text-sm font-semibold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    className={`appearance-none block w-full pl-10 pr-12 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 sm:text-sm cursor-text ${getInputClasses()} ${
                                        errors.password 
                                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                                            : isDarkMode ? 'border-gray-600 focus:border-indigo-500 focus:ring-indigo-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer hover:opacity-70 transition-opacity"
                                >
                                    {showPassword ? (
                                        <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            
                            {/* Password strength indicator */}
                            {formData.password && !errors.password && (
                                <div className="mt-2 space-y-1 transition-all duration-300">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${passwordStrength.barColor} transition-all duration-500 rounded-full`}
                                                style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                            />
                                        </div>
                                        <span className={`text-xs font-medium ${passwordStrength.textColor} transition-all duration-300`}>
                                            {passwordStrength.label}
                                        </span>
                                    </div>
                                    <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                        Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character.
                                    </p>
                                </div>
                            )}
                            
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500 flex items-center gap-1 animate-pulse">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="relative w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer overflow-hidden group"
                            >
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating account...
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </div>

                    </form>

                    {/* Login Link */}
                    <div className={`mt-6 text-center pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Already have an account?{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="font-semibold text-indigo-600 hover:text-indigo-500 transition-all duration-200 cursor-pointer hover:underline hover:scale-105 inline-block"
                            >
                                Sign in
                            </button>
                        </p>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 transition-all duration-300 ease-out" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                    <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-300" onClick={handleModalClose}></div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 relative z-10 transform transition-all duration-300 scale-100 opacity-100" style={{ animation: 'modalPopIn 0.3s ease-out' }}>
                        <div className="text-center">
                            <div className="mx-auto mb-4 relative">
                                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                </div>
                            </div>
                            
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Registration Successful!</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Your account has been created successfully. Please check your email to verify your account.
                            </p>
                            
                            <div className="space-y-3">
                                <button
                                    onClick={handleModalClose}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-md transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                                >
                                    Continue to Login
                                </button>
                                
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span>We've sent a verification email to your inbox</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    
                    @keyframes modalPopIn {
                        0% {
                            opacity: 0;
                            transform: scale(0.7);
                        }
                        50% {
                            transform: scale(1.05);
                        }
                        100% {
                            opacity: 1;
                            transform: scale(1);
                        }
                    }
                    
                    @keyframes modalPopOut {
                        0% {
                            opacity: 1;
                            transform: scale(1);
                        }
                        100% {
                            opacity: 0;
                            transform: scale(0.7);
                        }
                    }
                    
                    @keyframes slideInUp {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `
            }} />
        </div>
    );
}