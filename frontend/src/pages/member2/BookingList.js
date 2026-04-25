import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bookingService from '../../services/bookingService';
import AdminNav from '../../components/AdminNav';

export default function BookingList() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState('USER');
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const navigate = useNavigate();

    useEffect(() => {
        const userStr = localStorage.getItem('sch_user');
        if (userStr) {
            const user = JSON.parse(userStr);
            const roles = user.roles || ['USER'];
            const isAdmin = roles.includes('ADMIN');
            setUserRole(isAdmin ? 'ADMIN' : 'USER');
            setUserName(user.name || '');
            setUserEmail(user.email || '');
            
            if (window.location.pathname === '/admin-page/bookinglist' && !isAdmin) {
                navigate('/booking');
                return;
            }
            
            fetchBookings(isAdmin ? 'ADMIN' : 'USER');
        } else {
            if (window.location.pathname === '/admin-page/bookinglist') {
                navigate('/login');
                return;
            }
            fetchBookings('USER');
        }
    }, [navigate]);

    const fetchBookings = async (role) => {
        try {
            setLoading(true);
            let response;
            if (role === 'ADMIN') {
                response = await bookingService.getAllBookings();
            } else {
                response = await bookingService.getMyBookings();
            }
            setBookings(response.data?.data || []);
        } catch (error) {
            console.error("Error fetching bookings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            try {
                await bookingService.cancelBooking(id);
                fetchBookings(userRole);
            } catch (error) {
                alert(error.response?.data?.error || "Error cancelling booking");
            }
        }
    };

    const handleReview = async (id, status) => {
        const reason = window.prompt(`Please enter a reason for ${status}:`);
        if (reason !== null) {
            try {
                await bookingService.reviewBooking(id, { status, reason });
                fetchBookings(userRole);
            } catch (error) {
                alert(error.response?.data?.error || "Error reviewing booking");
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this booking?")) {
            try {
                await bookingService.deleteBooking(id);
                fetchBookings(userRole);
            } catch (error) {
                alert(error.response?.data?.error || "Error deleting booking");
            }
        }
    };

    const filteredBookings = filterStatus === 'ALL' 
        ? bookings 
        : bookings.filter(b => b.status === filterStatus);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white font-sans">
            {/* Google Font */}
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

            {userRole === 'ADMIN' && (
                <AdminNav 
                    userName={userName} 
                    userEmail={userEmail} 
                    onLogout={handleLogout} 
                />
            )}

            <div className="relative z-10 transition-all duration-500 opacity-100">
                {/* Animated Background Elements (behind content) */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse delay-2000"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">

                    {/* ── Header ── */}
                    <div className="mb-8 transform transition-all duration-500 translate-y-0 opacity-100">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                            {userRole === 'ADMIN' ? 'All Bookings' : 'My Bookings'}
                                        </h1>
                                        <p className="text-gray-400 mt-1">Review and manage campus facility bookings</p>
                                    </div>
                                </div>
                            </div>
                            
                            <button
                                onClick={() => navigate('/booking/new')}
                                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200 transform hover:scale-105"
                            >
                                + New Booking
                            </button>
                        </div>
                    </div>

                    {/* ── Filter Tabs ── */}
                    {userRole === 'ADMIN' && (
                        <div className="flex gap-2 mb-6 flex-wrap transform transition-all duration-500 delay-100 translate-y-0 opacity-100">
                            {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map(status => {
                                const isActive = filterStatus === status;
                                return (
                                    <button
                                        key={status}
                                        onClick={() => setFilterStatus(status)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 cursor-pointer border ${
                                            isActive 
                                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-transparent shadow-lg shadow-indigo-500/25' 
                                            : 'bg-gray-800/50 text-gray-400 border-gray-700 hover:bg-gray-700 hover:text-gray-200'
                                        }`}
                                    >
                                        {status}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* ── Content ── */}
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="relative">
                                <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                                <div className="mt-4 text-gray-400 font-medium">Loading requests...</div>
                            </div>
                        </div>
                    ) : filteredBookings.length === 0 ? (
                        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-16 text-center transform transition-all duration-500 delay-200">
                            <div className="text-6xl mb-4 opacity-50">📭</div>
                            <p className="text-gray-400 text-lg font-medium">No booking requests found.</p>
                        </div>
                    ) : (
                        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden transform transition-all duration-500 delay-200 translate-y-0 opacity-100">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-900/50 border-b border-gray-700">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Resource / Purpose</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Date & Time</th>
                                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Attendees</th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700/50">
                                        {filteredBookings.map(booking => {
                                            const isPending = booking.status === 'PENDING';
                                            return (
                                                <tr key={booking.id} className={`transition-colors duration-200 ${isPending ? 'bg-indigo-900/10 hover:bg-indigo-900/20' : 'hover:bg-gray-700/30'}`}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="font-bold text-gray-100">{booking.resourceId || '—'}</div>
                                                        <div className="text-gray-400 text-xs mt-1 max-w-[200px] overflow-hidden text-ellipsis" title={booking.purpose}>
                                                            {booking.purpose}
                                                        </div>
                                                        {booking.rejectionReason && (
                                                            <div className="text-indigo-400 text-xs mt-1 italic">
                                                                Note: {booking.rejectionReason}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {booking.status === 'PENDING' && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-amber-500/10 text-amber-400 border-amber-500/30"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>PENDING</span>}
                                                        {booking.status === 'APPROVED' && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-green-500/10 text-green-400 border-green-500/30"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>APPROVED</span>}
                                                        {booking.status === 'REJECTED' && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-red-500/10 text-red-400 border-red-500/30"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>REJECTED</span>}
                                                        {booking.status === 'CANCELLED' && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-gray-500/10 text-gray-400 border-gray-500/30"><span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>CANCELLED</span>}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="font-semibold text-gray-200 text-sm">{booking.date || '—'}</div>
                                                        <div className="text-gray-500 text-xs">{booking.startTime} – {booking.endTime}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <div className="font-bold text-gray-400">{booking.expectedAttendees ?? '—'}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <div className="flex justify-end gap-2">
                                                            {userRole === 'ADMIN' ? (
                                                                <>
                                                                    {booking.status === 'PENDING' && (
                                                                        <>
                                                                            <button onClick={() => handleReview(booking.id, 'APPROVED')} className="px-3 py-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-bold transition-all cursor-pointer">✓ Approve</button>
                                                                            <button onClick={() => handleReview(booking.id, 'REJECTED')} className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold transition-all cursor-pointer">✕ Reject</button>
                                                                        </>
                                                                    )}
                                                                    <button onClick={() => navigate(`/booking/edit/${booking.id}`)} className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-bold transition-all cursor-pointer">✎ Edit</button>
                                                                    <button onClick={() => handleDelete(booking.id)} className="px-3 py-1.5 rounded-lg bg-gray-700/50 hover:bg-gray-700 border border-gray-600 text-gray-300 text-xs font-bold transition-all cursor-pointer">🗑 Delete</button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {booking.status !== 'CANCELLED' && booking.status !== 'REJECTED' && (
                                                                        <button onClick={() => handleCancel(booking.id)} className="px-3 py-1.5 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-xs font-bold transition-all cursor-pointer">✕ Cancel</button>
                                                                    )}
                                                                    <button onClick={() => navigate(`/booking/edit/${booking.id}`)} className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-bold transition-all cursor-pointer">✎ Edit</button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
