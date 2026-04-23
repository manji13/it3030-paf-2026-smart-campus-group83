import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNav from '../../components/AdminNav';

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/notifications');
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleNotificationClick = async (notification) => {
        // Mark as read in the backend
        if (!notification.read) {
            try {
                await fetch(`http://localhost:8000/api/notifications/${notification.id}/read`, {
                    method: 'PUT'
                });
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
            await fetch('http://localhost:8000/api/notifications/read-all', { method: 'PUT' });
            fetchNotifications(); // Refresh list
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <AdminNav />
            
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Notifications</h1>
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
                                <div className="mt-1">
                                    {!notif.read ? (
                                        <div className="w-2.5 h-2.5 bg-red-500 rounded-full mt-1.5"></div>
                                    ) : (
                                        <div className="w-2.5 h-2.5 bg-gray-300 dark:bg-gray-600 rounded-full mt-1.5"></div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className={`text-base font-semibold ${!notif.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                        {notif.title}
                                    </h3>
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