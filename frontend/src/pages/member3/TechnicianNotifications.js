import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TechnicianNav from '../../components/TechnicianNav';

const API_BASE = 'http://localhost:8000';

const STATUS_META = {
    OPEN:        { label: 'Open',        emoji: '🔵', pill: 'bg-blue-100 text-blue-700 border-blue-200' },
    IN_PROGRESS: { label: 'In Progress', emoji: '🟡', pill: 'bg-amber-100 text-amber-700 border-amber-200' },
    RESOLVED:    { label: 'Resolved',    emoji: '✅', pill: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    CLOSED:      { label: 'Closed',      emoji: '⚫', pill: 'bg-gray-100 text-gray-600 border-gray-200' },
    REJECTED:    { label: 'Rejected',    emoji: '❌', pill: 'bg-red-100 text-red-700 border-red-200' },
};

function detectStatus(title = '', message = '') {
    const text = (title + ' ' + message).toUpperCase();
    for (const s of ['REJECTED', 'RESOLVED', 'CLOSED', 'IN_PROGRESS', 'OPEN']) {
        if (text.includes(s)) return s;
    }
    return null;
}

function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1)  return 'Just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
}

export default function TechnicianNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading]             = useState(true);
    const [filter, setFilter]               = useState('ALL');
    const navigate = useNavigate();

    const user      = JSON.parse(localStorage.getItem('sch_user') || '{}');
    const userEmail = user.email || '';
    const userName  = user.name  || user.email || 'Technician';

    const fetchNotifications = useCallback(async () => {
        if (!userEmail) { setLoading(false); return; }
        try {
            const token = localStorage.getItem('sch_token');
            const res = await fetch(`${API_BASE}/api/v1/member4/notifications/me`, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });
            if (res.ok) {
                const json = await res.json();
                setNotifications(Array.isArray(json) ? json : (json.data || []));
            }
        } catch (_) {}
        finally { setLoading(false); }
    }, [userEmail]);

    useEffect(() => {
        fetchNotifications();
        const iv = setInterval(fetchNotifications, 30000);
        return () => clearInterval(iv);
    }, [fetchNotifications]);

    const markRead = async (notif) => {
        if (!notif.read) {
            try {
                const token = localStorage.getItem('sch_token');
                await fetch(`${API_BASE}/api/v1/member4/notifications/${notif.id}/read`, { 
                    method: 'PATCH',
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });
                setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
            } catch (_) {}
        }
        if (notif.targetPath) navigate(notif.targetPath);
    };

    const markAllRead = async () => {
        try {
            const token = localStorage.getItem('sch_token');
            await fetch(`${API_BASE}/api/v1/member4/notifications/me/read-all`, { 
                method: 'PATCH',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (_) {}
    };

    const unreadCount = notifications.filter(n => !n.read).length;
    const displayed   = filter === 'UNREAD' ? notifications.filter(n => !n.read)
                      : filter === 'READ'   ? notifications.filter(n =>  n.read)
                      : notifications;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/40 to-cyan-50 dark:bg-gray-900">
            <TechnicianNav />

            <div className="max-w-2xl mx-auto px-4 py-10">

                {/* ── Hero header ──────────────────────────────────────────── */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-200">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">Notifications</h1>
                            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                <span className="inline-block w-2 h-2 rounded-full bg-teal-500" />
                                {userName} · Technician
                            </p>
                        </div>
                        {unreadCount > 0 && (
                            <span className="ml-auto inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow shadow-teal-200">
                                {unreadCount} new
                            </span>
                        )}
                    </div>
                </div>

                {/* ── Toolbar ──────────────────────────────────────────────── */}
                <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
                    <div className="flex gap-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-1 shadow-sm">
                        {[['ALL','All'], ['UNREAD','Unread'], ['READ','Read']].map(([val, label]) => (
                            <button
                                key={val}
                                onClick={() => setFilter(val)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                                    filter === val
                                        ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-md'
                                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                            >
                                {label}
                                {val === 'UNREAD' && unreadCount > 0 && (
                                    <span className="ml-1.5 bg-white/30 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {unreadCount > 0 && (
                        <button
                            onClick={markAllRead}
                            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-cyan-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 flex items-center gap-1.5"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Mark all read
                        </button>
                    )}
                </div>

                {/* ── Content ──────────────────────────────────────────────── */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <div className="relative w-14 h-14">
                            <div className="absolute inset-0 rounded-full border-4 border-teal-100 dark:border-teal-900/40" />
                            <div className="absolute inset-0 rounded-full border-4 border-t-teal-500 animate-spin" />
                        </div>
                        <p className="text-sm text-gray-400 font-medium">Loading notifications…</p>
                    </div>

                ) : displayed.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm p-14 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center">
                            <svg className="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <p className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">
                            {filter === 'UNREAD' ? 'All caught up!' : 'No notifications yet'}
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                            {filter === 'UNREAD'
                                ? 'You have no unread notifications right now.'
                                : 'Notifications will appear here when a ticket is assigned to you.'}
                        </p>
                    </div>

                ) : (
                    <div className="space-y-2">
                        {displayed.map((notif, idx) => {
                            const status = detectStatus(notif.title, notif.message);
                            const meta   = status ? STATUS_META[status] : null;

                            return (
                                <div
                                    key={notif.id}
                                    onClick={() => markRead(notif)}
                                    style={{ animationDelay: `${idx * 40}ms`, animation: 'slideUp 0.3s ease-out both' }}
                                    className={`group relative flex items-start gap-4 p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all duration-200
                                        ${!notif.read
                                            ? 'bg-white dark:bg-gray-800 border-teal-100 dark:border-teal-900/50 shadow-sm shadow-teal-100/60 hover:shadow-md hover:shadow-teal-100'
                                            : 'bg-gray-50/80 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800'
                                        }`}
                                >
                                    {/* Unread left accent strip */}
                                    {!notif.read && (
                                        <div className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full bg-gradient-to-b from-teal-500 to-cyan-500" />
                                    )}

                                    {/* Icon bubble */}
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg border ${
                                        meta
                                            ? meta.pill
                                            : !notif.read
                                                ? 'bg-teal-100 text-teal-600 border-teal-200'
                                                : 'bg-gray-100 text-gray-400 border-gray-200 dark:bg-gray-700 dark:border-gray-600'
                                    }`}>
                                        {meta ? meta.emoji : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                            </svg>
                                        )}
                                    </div>

                                    {/* Body */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <p className={`text-sm font-semibold leading-snug ${
                                                !notif.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'
                                            }`}>
                                                {notif.title}
                                            </p>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <span className="text-[11px] text-gray-400 whitespace-nowrap">{timeAgo(notif.createdAt)}</span>
                                                {!notif.read && <span className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0 animate-pulse" />}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">{notif.message}</p>
                                        {meta && (
                                            <span className={`inline-flex items-center gap-1 mt-2 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${meta.pill}`}>
                                                {meta.emoji} {meta.label}
                                            </span>
                                        )}
                                    </div>

                                    {/* Chevron */}
                                    {notif.targetPath && (
                                        <svg className="flex-shrink-0 w-4 h-4 text-gray-300 group-hover:text-teal-500 transition-colors mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {displayed.length > 0 && (
                    <p className="text-center text-xs text-gray-400 mt-6">
                        Showing {displayed.length} of {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
                    </p>
                )}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}} />
        </div>
    );
}
