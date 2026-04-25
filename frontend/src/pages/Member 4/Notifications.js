import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNav from '../../components/AdminNav';

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('sch_token');
            const response = await fetch('http://localhost:8000/api/v1/member4/notifications/me', {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });
            if (response.ok) {
                const data = await response.json();
                setNotifications(Array.isArray(data) ? data : (data.data || []));
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleNotificationClick = async (notification) => {
        // Mark as read in the backend
        if (!notification.read) {
            try {
                const token = localStorage.getItem('sch_token');
                await fetch(`http://localhost:8000/api/v1/member4/notifications/${notification.id}/read`, {
                    method: 'PATCH',
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });
                setNotifications(prev =>
                    prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
                );
            } catch (error) {
                console.error('Error marking as read:', error);
            }
        }
        // Navigate to the target path (e.g., /ticketList)
        if (notification.targetPath) {
            navigate(notification.targetPath);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const token = localStorage.getItem('sch_token');
            await fetch('http://localhost:8000/api/v1/member4/notifications/me/read-all', { 
                method: 'PATCH',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });
            fetchNotifications();
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <AdminNav />
            
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Notifications</h1>
                        {unreadCount > 0 && (
                            <p className="text-sm text-indigo-600 font-medium mt-0.5">{unreadCount} unread</p>
                        )}
                    </div>
                    <button 
                        onClick={handleMarkAllAsRead}
                        className="text-sm px-4 py-2 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 transition-colors"
                    >
                        Mark all as read
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading notifications...</div>
                ) : notifications.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700">
                        You have no notifications.
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        {notifications.map((notif) => (
                            <div 
                                key={notif.id}
                                onClick={() => handleNotificationClick(notif)}
                                className={`p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-start gap-4 ${
                                    !notif.read ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''
                                }`}
                            >
                                {/* Unread dot */}
                                <div className="mt-1 flex-shrink-0">
                                    {!notif.read ? (
                                        <div className="w-2.5 h-2.5 bg-red-500 rounded-full mt-1.5"></div>
                                    ) : (
                                        <div className="w-2.5 h-2.5 bg-gray-300 dark:bg-gray-600 rounded-full mt-1.5"></div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className={`text-base font-semibold ${!notif.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                        {notif.title}
                                    </h3>

                                    {/* User name badge */}
                                    {notif.userName && (
                                        <span className="inline-flex items-center gap-1 mt-1 mb-1.5 text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400 px-2 py-0.5 rounded-full font-medium">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            {notif.userName}
                                        </span>
                                    )}

                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        {notif.message}
                                    </p>
                                    <span className="text-xs text-gray-400 dark:text-gray-500 mt-2 block">
                                        {new Date(notif.createdAt).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}