import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export default function Login() {

    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const navigate = useNavigate();

    // ── Email/Password Login ────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/api/users/login', credentials);
            const user = response.data;
            localStorage.setItem('user', JSON.stringify(user));
            if (user.role === 'ADMIN') {
                navigate('/admin-page');
            } else {
                navigate('/student-page');
            }
        } catch (error) {
            alert("Invalid email or password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // ── Google Login ────────────────────────────────────────────────────────
    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setGoogleLoading(true);
            try {
                const response = await axios.post('http://localhost:8000/api/users/google-login', {
                    token: tokenResponse.access_token
                });
                const user = response.data;
                localStorage.setItem('user', JSON.stringify(user));
                if (user.role === 'ADMIN') {
                    navigate('/admin-page');
                } else {
                    navigate('/student-page');
                }
            } catch (error) {
                alert("Google Sign-In failed. Please try again.");
            } finally {
                setGoogleLoading(false);
            }
        },
        onError: () => {
            alert("Google Sign-In was cancelled or failed.");
        },
    });

    // ── UI ──────────────────────────────────────────────────────────────────
    return (
        <div style={styles.page}>
            <div style={styles.card}>

                {/* Header */}
                <div style={styles.header}>
                    <div style={styles.logoRing}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                                stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h2 style={styles.title}>Welcome back</h2>
                    <p style={styles.subtitle}>Sign in to Smart Campus</p>
                </div>

                {/* Google Button */}
                <button
                    id="google-signin-btn"
                    onClick={() => handleGoogleLogin()}
                    disabled={googleLoading}
                    style={{
                        ...styles.googleBtn,
                        opacity: googleLoading ? 0.7 : 1,
                        cursor: googleLoading ? 'not-allowed' : 'pointer',
                    }}
                    onMouseEnter={e => { if (!googleLoading) e.currentTarget.style.background = '#f1f5f9'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; }}
                >
                    {googleLoading ? (
                        <span style={styles.googleBtnText}>Signing in...</span>
                    ) : (
                        <>
                            <svg width="20" height="20" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                                <path fill="none" d="M0 0h48v48H0z" />
                            </svg>
                            <span style={styles.googleBtnText}>Sign in with Google</span>
                        </>
                    )}
                </button>

                {/* Divider */}
                <div style={styles.dividerRow}>
                    <div style={styles.dividerLine} />
                    <span style={styles.dividerText}>or sign in with email</span>
                    <div style={styles.dividerLine} />
                </div>

                {/* Email / Password Form */}
                <form onSubmit={handleSubmit} style={styles.form}>

                    <div style={styles.fieldGroup}>
                        <label htmlFor="email" style={styles.label}>Email address</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            onChange={e => setCredentials({ ...credentials, email: e.target.value })}
                            required
                            style={styles.input}
                            onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'; }}
                            onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                        />
                    </div>

                    <div style={styles.fieldGroup}>
                        <label htmlFor="password" style={styles.label}>Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                            required
                            style={styles.input}
                            onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'; }}
                            onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                        />
                    </div>

                    <button
                        id="signin-btn"
                        type="submit"
                        disabled={isLoading}
                        style={{
                            ...styles.submitBtn,
                            opacity: isLoading ? 0.7 : 1,
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                        }}
                        onMouseEnter={e => { if (!isLoading) e.currentTarget.style.background = '#4f46e5'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#6366f1'; }}
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                {/* Footer */}
                <div style={styles.footer}>
                    <p style={styles.footerText}>
                        Don't have an account?{' '}
                        <button
                            onClick={() => navigate('/register')}
                            style={styles.linkBtn}
                            onMouseEnter={e => { e.currentTarget.style.color = '#4f46e5'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = '#6366f1'; }}
                        >
                            Register here
                        </button>
                    </p>
                </div>

            </div>
        </div>
    );
}

// ── Styles ──────────────────────────────────────────────────────────────────
const styles = {
    page: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f0f4ff 0%, #fafafa 50%, #f0f4ff 100%)',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        padding: '24px 16px',
    },
    card: {
        width: '100%',
        maxWidth: '420px',
        background: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 4px 32px rgba(99, 102, 241, 0.12), 0 1px 4px rgba(0,0,0,0.06)',
        padding: '40px 36px',
        border: '1px solid rgba(99,102,241,0.08)',
    },
    header: {
        textAlign: 'center',
        marginBottom: '28px',
    },
    logoRing: {
        width: '56px',
        height: '56px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px auto',
        boxShadow: '0 2px 8px rgba(99,102,241,0.15)',
    },
    title: {
        fontSize: '26px',
        fontWeight: '700',
        color: '#1e1b4b',
        margin: '0 0 6px 0',
        letterSpacing: '-0.5px',
    },
    subtitle: {
        fontSize: '14px',
        color: '#64748b',
        margin: 0,
    },
    googleBtn: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '12px 20px',
        background: '#ffffff',
        border: '1.5px solid #e2e8f0',
        borderRadius: '12px',
        fontSize: '15px',
        fontWeight: '500',
        color: '#374151',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'all 0.2s ease',
        marginBottom: '20px',
    },
    googleBtnText: {
        fontSize: '15px',
        fontWeight: '500',
    },
    dividerRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px',
    },
    dividerLine: {
        flex: 1,
        height: '1px',
        background: '#e9edf5',
    },
    dividerText: {
        fontSize: '12px',
        color: '#94a3b8',
        whiteSpace: 'nowrap',
        fontWeight: '500',
        letterSpacing: '0.02em',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    fieldGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    label: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#374151',
    },
    input: {
        width: '100%',
        padding: '11px 14px',
        border: '1.5px solid #e2e8f0',
        borderRadius: '10px',
        fontSize: '14px',
        color: '#1e293b',
        background: '#fafbff',
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxSizing: 'border-box',
    },
    submitBtn: {
        width: '100%',
        padding: '13px',
        background: '#6366f1',
        color: '#ffffff',
        border: 'none',
        borderRadius: '12px',
        fontSize: '15px',
        fontWeight: '600',
        letterSpacing: '0.01em',
        boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
        transition: 'all 0.2s ease',
        marginTop: '4px',
    },
    footer: {
        textAlign: 'center',
        marginTop: '24px',
        paddingTop: '20px',
        borderTop: '1px solid #f1f5f9',
    },
    footerText: {
        fontSize: '14px',
        color: '#64748b',
        margin: 0,
    },
    linkBtn: {
        background: 'none',
        border: 'none',
        color: '#6366f1',
        fontWeight: '600',
        fontSize: '14px',
        cursor: 'pointer',
        padding: 0,
        transition: 'color 0.2s',
    },
};