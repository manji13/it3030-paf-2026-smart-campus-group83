import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
    // ---------------------------------------------------------
    // YOUR ORIGINAL LOGIC (UNTOUCHED)
    // ---------------------------------------------------------
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/users/login', credentials);
            const user = response.data;
            
            // Save user to local storage for session management
            localStorage.setItem('user', JSON.stringify(user));

            // Navigate based on Role
            if (user.role === 'ADMIN') {
                navigate('/admin-page');
            } else {
                navigate('/student-page');
            }

        } catch (error) {
            alert("Invalid Credentials");
        }
    };

    // ---------------------------------------------------------
    // NEW PERFECT UI (UPGRADED RETURN STATEMENT)
    // ---------------------------------------------------------
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                
                {/* Header */}
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to your account
                    </p>
                </div>

                {/* Form */}
                <form className="space-y-6" onSubmit={handleSubmit}>
                    
                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <div className="mt-1">
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                onChange={e => setCredentials({...credentials, email: e.target.value})}
                                required
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="mt-1">
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                onChange={e => setCredentials({...credentials, password: e.target.value})}
                                required
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
                        >
                            Sign In
                        </button>
                    </div>
                </form>

                {/* Go to Register Navigation */}
                <div className="mt-8 text-center border-t border-gray-100 pt-6">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <button 
                            onClick={() => navigate('/register')}
                            className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none transition-colors duration-200"
                        >
                            Register here
                        </button>
                    </p>
                </div>

            </div>
        </div>
    );
}