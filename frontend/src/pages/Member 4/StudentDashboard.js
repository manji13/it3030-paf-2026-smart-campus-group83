// StudentDashboard.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function StudentDashboard() {
    const navigate = useNavigate();
    const { user, isAuthenticated, loading } = useAuth();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, loading, navigate]);

    // Redirect admin users to admin dashboard
    useEffect(() => {
        if (!loading && user?.roles?.includes('ADMIN')) {
            navigate('/admin-page');
        }
    }, [user, loading, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    const handleNavigateToBooking = () => {
        navigate('/booking');
    };

    const handleNavigateToFacilities = () => {
        navigate('/facilities');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-12">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">
                            Welcome, <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">{user?.name || 'Student'}</span>!
                        </h1>
                        <p className="text-slate-400 text-lg">{user?.email}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-slate-400">Dashboard</p>
                        <p className="text-2xl font-semibold text-teal-400">{user?.roles?.join(', ') || 'USER'}</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Booking Card */}
                    <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-8 border border-slate-700 hover:border-teal-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer group"
                        onClick={handleNavigateToBooking}>
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-14 h-14 bg-teal-500/20 rounded-xl flex items-center justify-center group-hover:bg-teal-500/30 transition-colors">
                                <svg className="w-7 h-7 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="text-xs font-semibold text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full">Available</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Make a Booking</h3>
                        <p className="text-slate-400 mb-6">Reserve resources and facilities for your needs. Browse available slots and book now.</p>
                        <button 
                            type="button"
                            onClick={handleNavigateToBooking}
                            className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95">
                            Go to Bookings →
                        </button>
                    </div>

                    {/* Facilities Card */}
                    <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-8 border border-slate-700 hover:border-indigo-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer group"
                        onClick={handleNavigateToFacilities}>
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-14 h-14 bg-indigo-500/20 rounded-xl flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors">
                                <svg className="w-7 h-7 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full">View All</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Browse Facilities</h3>
                        <p className="text-slate-400 mb-6">Explore all available resources, facilities, and assets on campus. Check capacity and location details.</p>
                        <button 
                            type="button"
                            onClick={handleNavigateToFacilities}
                            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95">
                            View Facilities →
                        </button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-8 border border-slate-700 shadow-xl">
                    <h2 className="text-2xl font-bold mb-6">Quick Links</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button 
                            type="button"
                            onClick={handleNavigateToBooking}
                            className="py-3 px-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-left transition-colors">
                            <p className="text-slate-400 text-sm">My Bookings</p>
                            <p className="text-xl font-semibold text-teal-400">View & Manage</p>
                        </button>
                        <button 
                            type="button"
                            onClick={handleNavigateToFacilities}
                            className="py-3 px-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-left transition-colors">
                            <p className="text-slate-400 text-sm">Available Resources</p>
                            <p className="text-xl font-semibold text-indigo-400">Browse All</p>
                        </button>
                        <div className="py-3 px-4 bg-slate-700/50 rounded-lg text-left">
                            <p className="text-slate-400 text-sm">Account Status</p>
                            <p className="text-xl font-semibold text-green-400">Active</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}