import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNav from '../../components/AdminNav';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area,
} from 'recharts';

const API_BASE = 'http://localhost:8000';

/* ── colour palettes ─────────────────────────────────────────── */
const USER_COLORS   = ['#6366f1', '#14b8a6', '#3b82f6'];   // admin | tech | user
const TICKET_COLORS = {
    OPEN:        '#6366f1',
    IN_PROGRESS: '#f59e0b',
    RESOLVED:    '#10b981',
    CLOSED:      '#6b7280',
    REJECTED:    '#ef4444',
};

/* ── tiny helpers ────────────────────────────────────────────── */
function StatCard({ title, value, sub, icon, gradient }) {
    return (
        <div className={`relative overflow-hidden rounded-2xl p-5 text-white shadow-lg ${gradient}`}>
            <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
            <div className="absolute -right-2 -bottom-6 w-32 h-32 rounded-full bg-white/5" />
            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-white/70">{title}</p>
                    <p className="text-4xl font-extrabold mt-1 leading-none">{value}</p>
                    {sub && <p className="text-xs text-white/60 mt-1">{sub}</p>}
                </div>
                <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-2xl">
                    {icon}
                </div>
            </div>
        </div>
    );
}

/* custom pie label */
const RADIAN = Math.PI / 180;
function PieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) {
    if (percent < 0.05) return null;
    const r  = innerRadius + (outerRadius - innerRadius) * 0.55;
    const x  = cx + r * Math.cos(-midAngle * RADIAN);
    const y  = cy + r * Math.sin(-midAngle * RADIAN);
    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700}>
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
}

/* ── main component ──────────────────────────────────────────── */
export default function AdminDashboard() {
    const navigate = useNavigate();

    const [users,       setUsers]       = useState([]);
    const [tickets,     setTickets]     = useState([]);
    const [loadingU,    setLoadingU]    = useState(true);
    const [loadingT,    setLoadingT]    = useState(true);
    const [pageLoaded,  setPageLoaded]  = useState(false);

    const adminUser = JSON.parse(localStorage.getItem('user') || '{}');

    /* fetch */
    const fetchUsers = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/api/users`);
            if (res.ok) setUsers(await res.json());
        } catch (_) {}
        finally { setLoadingU(false); }
    }, []);

    const fetchTickets = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/api/tickets`);
            if (res.ok) setTickets(await res.json());
        } catch (_) {}
        finally { setLoadingT(false); }
    }, []);

    useEffect(() => {
        setPageLoaded(true);
        fetchUsers();
        fetchTickets();
        const iv = setInterval(() => { fetchUsers(); fetchTickets(); }, 60000);
        return () => clearInterval(iv);
    }, []);

    /* ── derived stats ─────────────────────────────────────────── */
    const admins      = users.filter(u => u.role === 'ADMIN').length;
    const technicians = users.filter(u => u.role === 'TECHNICIAN').length;
    const regularUsers= users.filter(u => u.role === 'USER').length;

    const openTickets     = tickets.filter(t => t.status === 'OPEN').length;
    const inProgress      = tickets.filter(t => t.status === 'IN_PROGRESS').length;
    const resolved        = tickets.filter(t => t.status === 'RESOLVED').length;
    const closed          = tickets.filter(t => t.status === 'CLOSED').length;
    const rejected        = tickets.filter(t => t.status === 'REJECTED').length;

    /* ── chart data ────────────────────────────────────────────── */
    const userPieData = [
        { name: 'Admins',      value: admins },
        { name: 'Technicians', value: technicians },
        { name: 'Users',       value: regularUsers },
    ].filter(d => d.value > 0);

    const ticketBarData = [
        { name: 'Open',        value: openTickets,  color: TICKET_COLORS.OPEN },
        { name: 'In Progress', value: inProgress,   color: TICKET_COLORS.IN_PROGRESS },
        { name: 'Resolved',    value: resolved,     color: TICKET_COLORS.RESOLVED },
        { name: 'Closed',      value: closed,       color: TICKET_COLORS.CLOSED },
        { name: 'Rejected',    value: rejected,     color: TICKET_COLORS.REJECTED },
    ];

    /* simple daily-ish ticket trend (last 7 groups by date) */
    const trendData = (() => {
        const map = {};
        tickets.forEach(t => {
            if (!t.createdAt) return;
            const d = new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            map[d] = (map[d] || 0) + 1;
        });
        const sorted = Object.entries(map).sort((a, b) => new Date(a[0]) - new Date(b[0]));
        return sorted.slice(-7).map(([date, count]) => ({ date, count }));
    })();

    const loading = loadingU || loadingT;

    return (
        <div className={`min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900 transition-opacity duration-700 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <AdminNav />

            {/* Ambient blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-700 rounded-full filter blur-3xl opacity-10 animate-pulse" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-700 rounded-full filter blur-3xl opacity-10 animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* ── Welcome banner ─────────────────────────────────────── */}
                <div className="mb-8">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold text-white">
                                Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{adminUser.name || 'Admin'}</span> 👋
                            </h1>
                            <p className="text-gray-400 text-sm mt-1">Here's what's happening across Smart Campus today.</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => navigate('/users')}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-900/40"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                Manage Users
                            </button>
                            <button
                                onClick={() => navigate('/ticketList')}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-all shadow-lg shadow-purple-900/40"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                                View Tickets
                            </button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 rounded-full border-4 border-indigo-900/40" />
                            <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin" />
                        </div>
                        <p className="text-gray-400 text-sm">Loading dashboard data…</p>
                    </div>
                ) : (
                    <>
                        {/* ── KPI STAT CARDS ─────────────────────────────────────── */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                            <StatCard title="Total Users"    value={users.length}   icon="👥" gradient="bg-gradient-to-br from-indigo-600 to-indigo-800"   sub="All roles" />
                            <StatCard title="Admins"         value={admins}         icon="🛡️" gradient="bg-gradient-to-br from-purple-600 to-purple-800"    sub="Role: Admin" />
                            <StatCard title="Technicians"    value={technicians}    icon="🔧" gradient="bg-gradient-to-br from-teal-600 to-teal-800"        sub="Role: Technician" />
                            <StatCard title="Total Tickets"  value={tickets.length} icon="🎫" gradient="bg-gradient-to-br from-blue-600 to-blue-800"        sub="All statuses" />
                            <StatCard title="Open"           value={openTickets}    icon="🔵" gradient="bg-gradient-to-br from-sky-600 to-sky-800"           sub="Awaiting action" />
                            <StatCard title="Resolved"       value={resolved}       icon="✅" gradient="bg-gradient-to-br from-emerald-600 to-emerald-800"  sub="Completed" />
                        </div>

                        {/* ── ROW 1: Pie + Bar ───────────────────────────────────── */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

                            {/* User Distribution Pie */}
                            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-xl">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                    <h2 className="text-base font-bold text-white">User Distribution</h2>
                                </div>
                                <p className="text-xs text-gray-400 mb-5">Breakdown of {users.length} registered users by role</p>

                                {userPieData.length === 0 ? (
                                    <p className="text-gray-500 text-sm text-center py-12">No user data yet.</p>
                                ) : (
                                    <ResponsiveContainer width="100%" height={280}>
                                        <PieChart>
                                            <Pie
                                                data={userPieData}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={105}
                                                innerRadius={55}
                                                paddingAngle={3}
                                                dataKey="value"
                                                labelLine={false}
                                                label={PieLabel}
                                            >
                                                {userPieData.map((_, i) => (
                                                    <Cell key={i} fill={USER_COLORS[i % USER_COLORS.length]} stroke="transparent" />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: 12, color: '#f3f4f6', fontSize: 13 }}
                                                formatter={(v, n) => [`${v} users`, n]}
                                            />
                                            <Legend
                                                iconType="circle"
                                                iconSize={9}
                                                formatter={(v) => <span style={{ color: '#9ca3af', fontSize: 12 }}>{v}</span>}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}

                                {/* legend chips */}
                                <div className="flex gap-3 mt-2 flex-wrap justify-center">
                                    {[['Admins', admins, '#6366f1'], ['Technicians', technicians, '#14b8a6'], ['Users', regularUsers, '#3b82f6']].map(([label, count, color]) => (
                                        <div key={label} className="flex items-center gap-1.5 bg-gray-700/40 rounded-lg px-3 py-1.5">
                                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                                            <span className="text-xs text-gray-300">{label}</span>
                                            <span className="text-xs font-bold text-white">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Ticket Status Bar Chart */}
                            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-xl">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                                    <h2 className="text-base font-bold text-white">Ticket Status Breakdown</h2>
                                </div>
                                <p className="text-xs text-gray-400 mb-5">All {tickets.length} tickets by current status</p>

                                {tickets.length === 0 ? (
                                    <p className="text-gray-500 text-sm text-center py-12">No ticket data yet.</p>
                                ) : (
                                    <ResponsiveContainer width="100%" height={280}>
                                        <BarChart data={ticketBarData} barCategoryGap="30%">
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                            <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
                                            <YAxis allowDecimals={false} tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: 12, color: '#f3f4f6', fontSize: 13 }}
                                                formatter={(v) => [`${v} tickets`]}
                                                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                                            />
                                            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                                {ticketBarData.map((entry, i) => (
                                                    <Cell key={i} fill={entry.color} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>

                        {/* ── ROW 2: Area trend + Donut ──────────────────────────── */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

                            {/* Ticket submission trend (area chart) */}
                            <div className="lg:col-span-2 bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-xl">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-cyan-500" />
                                    <h2 className="text-base font-bold text-white">Ticket Submission Trend</h2>
                                </div>
                                <p className="text-xs text-gray-400 mb-5">Tickets submitted per day (last 7 active days)</p>
                                {trendData.length === 0 ? (
                                    <p className="text-gray-500 text-sm text-center py-12">No trend data available.</p>
                                ) : (
                                    <ResponsiveContainer width="100%" height={220}>
                                        <AreaChart data={trendData}>
                                            <defs>
                                                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.35} />
                                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                            <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
                                            <YAxis allowDecimals={false} tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: 12, color: '#f3f4f6', fontSize: 13 }}
                                                formatter={(v) => [`${v} tickets`, 'Submitted']}
                                            />
                                            <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2.5} fill="url(#trendGrad)" dot={{ fill: '#6366f1', r: 4 }} activeDot={{ r: 6 }} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                )}
                            </div>

                            {/* Ticket resolution donut */}
                            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-xl flex flex-col">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <h2 className="text-base font-bold text-white">Resolution Rate</h2>
                                </div>
                                <p className="text-xs text-gray-400 mb-4">Resolved vs unresolved tickets</p>

                                {(() => {
                                    const unresolved = openTickets + inProgress + rejected;
                                    const resData = [
                                        { name: 'Resolved', value: resolved + closed },
                                        { name: 'Unresolved', value: unresolved },
                                    ].filter(d => d.value > 0);
                                    const rate = tickets.length > 0
                                        ? Math.round(((resolved + closed) / tickets.length) * 100)
                                        : 0;
                                    return (
                                        <div className="flex-1 flex flex-col items-center justify-center">
                                            <div className="relative w-36 h-36 mb-4">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie data={resData} cx="50%" cy="50%" innerRadius={44} outerRadius={60} paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}>
                                                            <Cell fill="#10b981" />
                                                            <Cell fill="#374151" />
                                                        </Pie>
                                                    </PieChart>
                                                </ResponsiveContainer>
                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                    <span className="text-2xl font-extrabold text-white">{rate}%</span>
                                                    <span className="text-[10px] text-gray-400">resolved</span>
                                                </div>
                                            </div>
                                            <div className="w-full space-y-2">
                                                {[
                                                    { label: 'Resolved + Closed', value: resolved + closed, color: '#10b981' },
                                                    { label: 'Open / Pending', value: openTickets + inProgress, color: '#6366f1' },
                                                    { label: 'Rejected', value: rejected, color: '#ef4444' },
                                                ].map(r => (
                                                    <div key={r.label} className="flex items-center justify-between text-xs">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                                                            <span className="text-gray-400">{r.label}</span>
                                                        </div>
                                                        <span className="font-bold text-white">{r.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>

                        {/* ── ROW 3: Quick-action cards ──────────────────────────── */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { icon: '🎫', label: 'Ticket List', sub: 'Assign & review tickets', color: 'from-indigo-600 to-purple-600', path: '/ticketList' },
                                { icon: '👥', label: 'Manage Users', sub: 'Roles & access control', color: 'from-teal-500 to-cyan-600',   path: '/users' },
                                { icon: '🔔', label: 'Notifications', sub: 'Admin alerts & updates',  color: 'from-amber-500 to-orange-500', path: '/notifications' },
                            ].map(q => (
                                <button
                                    key={q.label}
                                    onClick={() => navigate(q.path)}
                                    className={`group relative overflow-hidden bg-gradient-to-br ${q.color} rounded-2xl p-5 text-left text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
                                >
                                    <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/10 group-hover:w-28 group-hover:h-28 transition-all duration-500" />
                                    <span className="text-3xl block mb-2">{q.icon}</span>
                                    <p className="font-bold text-sm">{q.label}</p>
                                    <p className="text-xs text-white/70">{q.sub}</p>
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}