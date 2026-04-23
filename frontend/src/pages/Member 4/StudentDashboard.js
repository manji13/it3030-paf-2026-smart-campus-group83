import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserNav from '../../components/UserNav';

export default function StudentDashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userName = user.name || user.email || 'Student';

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <UserNav />

            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Welcome card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-xl">{userName.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {userName}! 👋</h1>
                            <p className="text-gray-500 text-sm mt-0.5">Smart Campus Operations Hub — Student Portal</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            onClick={() => navigate('/ticketForm')}
                            className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <p className="font-semibold">Place a Ticket</p>
                                <p className="text-xs text-indigo-200">Report an issue or request</p>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/my-tickets')}
                            className="flex items-center gap-3 p-4 bg-white border-2 border-indigo-100 text-indigo-700 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <p className="font-semibold">My Tickets</p>
                                <p className="text-xs text-indigo-400">Track your submitted tickets</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Quick info */}
                <p className="text-center text-sm text-gray-400">
                    Use the navbar above to quickly navigate. Click the 🔔 bell to see your notifications.
                </p>
            </div>
        </div>
    );
}