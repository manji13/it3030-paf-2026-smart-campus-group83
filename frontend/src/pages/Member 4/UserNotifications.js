import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import UserNav from '../../components/UserNav';

const API_BASE = 'http://localhost:8000';

const STATUS_ICON = {
    'OPEN':        { emoji: '🔵', color: 'text-blue-600 bg-blue-50 border-blue-100' },
    'IN_PROGRESS': { emoji: '🟡', color: 'text-yellow-600 bg-yellow-50 border-yellow-100' },
    'RESOLVED':    { emoji: '🟢', color: 'text-green-600 bg-green-50 border-green-100' },
    'CLOSED':      { emoji: '⚫', color: 'text-gray-600 bg-gray-50 border-gray-200' },
    'REJECTED':    { emoji: '🔴', color: 'text-red-600 bg-red-50 border-red-100' },
};

function detectStatus(title = '', message = '') {
    const text = (title + ' ' + message).toUpperCase();
    for (const s of ['REJECTED', 'RESOLVED', 'CLOSED', 'IN_PROGRESS', 'OPEN']) {
        if (text.includes(s)) return s;
    }
    return null;
}

export default function UserNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userEmail = user.email || '';
    const userName  = user.name  || user.email || 'User';

    const fetchNotifications = useCallback(async () => {
        if (!userEmail) { setLoading(false); return; }
        try {
            const res = await fetch(`${API_BASE}/api/notifications/user?email=${encodeURIComponent(userEmail)}`);
            if (res.ok) setNotifications(await res.json());
        } catch (_) {}
        finally { setLoading(false); }
    }, [userEmail]);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const handleClick = async (notif) => {
        if (!notif.read) {
            try {
                await fetch(`${API_BASE}/api/notifications/${notif.id}/read`, { method: 'PUT' });
                setNotifications(prev =>
                    prev.map(n => n.id === notif.id ? { ...n, read: true } : n)
                );
            } catch (_) {}
        }
        if (notif.targetPath) navigate(notif.targetPath);
    };

    const handleMarkAllRead = async () => {
        try {
            await fetch(`${API_BASE}/api/notifications/user/read-all?email=${encodeURIComponent(userEmail)}`, { method: 'PUT' });
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (_) {}
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:bg-gray-900 transition-colors duration-300">
            <UserNav />

            <div className="max-w-3xl mx-auto px-4 py-8">

                {/* Header */}
                <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            My Notifications
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            {userName} · {unreadCount > 0 ? <span className="text-indigo-600 font-medium">{unreadCount} unread</span> : 'All caught up!'}
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            className="text-sm px-4 py-2 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/40 transition-colors font-medium"
                        >
                            Mark all as read
                        </button>
                    )}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
                        <svg className="animate-spin w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span className="text-sm">Loading notifications...</span>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
                        <div className="text-5xl mb-4">🔔</div>
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">No notifications yet</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                            Submit a ticket or wait for status updates to see notifications here.
                        </p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        {notifications.map((notif, idx) => {
                            const detectedStatus = detectStatus(notif.title, notif.message);
                            const statusMeta = detectedStatus ? STATUS_ICON[detectedStatus] : null;

                            return (
                                <div
                                    key={notif.id}
                                    onClick={() => handleClick(notif)}
                                    className={`p-4 sm:p-5 border-b border-gray-100 dark:border-gray-700 last:border-b-0 cursor-pointer transition-all duration-200 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 flex items-start gap-4 ${
                                        !notif.read ? 'bg-indigo-50/40 dark:bg-indigo-900/10' : ''
                                    }`}
                                    style={{ animationDelay: `${idx * 30}ms` }}
                                >
                                    {/* Status / unread indicator */}
                                    <div className="flex-shrink-0 pt-0.5">
                                        {statusMeta ? (
                                            <span className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-lg border ${statusMeta.color}`}>
                                                {statusMeta.emoji}
                                            </span>
                                        ) : (
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                                                !notif.read
                                                    ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400'
                                                    : 'bg-gray-100 text-gray-400 dark:bg-gray-700'
                                            }`}>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className={`text-sm font-semibold leading-snug ${
                                                !notif.read
                                                    ? 'text-gray-900 dark:text-white'
                                                    : 'text-gray-600 dark:text-gray-400'
                                            }`}>
                                                {notif.title}
                                            </h3>
                                            {!notif.read && (
                                                <span className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-1.5" />
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                            {notif.message}
                                        </p>
                                        <span className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 block">
                                            {new Date(notif.createdAt).toLocaleString('en-US', {
                                                month: 'short', day: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </span>
                                    </div>

                                    {/* Chevron */}
                                    {notif.targetPath && (
                                        <svg className="flex-shrink-0 w-4 h-4 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
