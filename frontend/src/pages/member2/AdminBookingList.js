import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNav from '../../components/AdminNav';
import bookingService from '../../services/bookingService';

const STATUS_COLORS = {
    PENDING:   { bg: 'bg-amber-100',  text: 'text-amber-800',  border: 'border-amber-300',  dot: 'bg-amber-400'  },
    APPROVED:  { bg: 'bg-green-100',  text: 'text-green-800',  border: 'border-green-300',  dot: 'bg-green-500'  },
    REJECTED:  { bg: 'bg-red-100',    text: 'text-red-800',    border: 'border-red-300',    dot: 'bg-red-500'    },
    CANCELLED: { bg: 'bg-gray-100',   text: 'text-gray-700',   border: 'border-gray-300',   dot: 'bg-gray-400'   },
};

export default function AdminBookingList() {
    const [bookings, setBookings]           = useState([]);
    const [loading, setLoading]             = useState(true);
    const [filterStatus, setFilterStatus]   = useState('ALL');
    const [userName, setUserName]           = useState('');
    const [userEmail, setUserEmail]         = useState('');
    const [reviewModal, setReviewModal]     = useState(null); // { id, action }
    const [reviewReason, setReviewReason]   = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const navigate = useNavigate();

    /* ── Auth guard ── */
    useEffect(() => {
        const userStr = localStorage.getItem('sch_user');
        if (!userStr) { navigate('/login'); return; }
        const user = JSON.parse(userStr);
        const roles = user.roles || [];
        if (!roles.includes('ADMIN')) { navigate('/student-page'); return; }
        setUserName(user.name  || '');
        setUserEmail(user.email || '');
    }, [navigate]);

    /* ── Fetch bookings ── */
    const fetchBookings = useCallback(async () => {
        try {
            setLoading(true);
            const res = await bookingService.getAllBookings();
            setBookings(res.data?.data || []);
        } catch (err) {
            console.error('Error fetching bookings', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchBookings(); }, [fetchBookings]);

    /* ── Derived data ── */
    const filtered = filterStatus === 'ALL'
        ? bookings
        : bookings.filter(b => b.status === filterStatus);

    const pendingCount = bookings.filter(b => b.status === 'PENDING').length;

    /* ── Actions ── */
    const openReview = (id, action) => {
        setReviewReason('');
        setReviewModal({ id, action });
    };

    const submitReview = async () => {
        if (!reviewReason.trim()) { alert('Please enter a reason.'); return; }
        setActionLoading(true);
        try {
            await bookingService.reviewBooking(reviewModal.id, {
                status: reviewModal.action,
                reason: reviewReason,
            });
            setReviewModal(null);
            fetchBookings();
        } catch (err) {
            alert(err.response?.data?.error || 'Error processing booking.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this booking request permanently?')) return;
        try {
            await bookingService.reviewBooking(id, { status: 'REJECTED', reason: 'Deleted by admin' });
            fetchBookings();
        } catch (err) {
            alert(err.response?.data?.error || 'Error deleting booking.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const formatDateTime = (date, start, end) =>
        `${date || '—'}  ·  ${start || ''}–${end || ''}`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            {/* Google Font */}
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

            <AdminNav userName={userName} userEmail={userEmail} onLogout={handleLogout} />

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
                                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Booking Requests</h1>
                                        <p className="text-gray-400 mt-1">Review and manage all campus facility bookings</p>
                                    </div>
                                </div>
                            </div>

                            {pendingCount > 0 && (
                                <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 backdrop-blur-sm">
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                                    <span className="font-semibold text-amber-400 text-sm">
                                        {pendingCount} pending {pendingCount === 1 ? 'request' : 'requests'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Filter Tabs ── */}
                    <div className="flex gap-2 mb-6 flex-wrap transform transition-all duration-500 delay-100 translate-y-0 opacity-100">
                        {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map(s => {
                            const isActive = filterStatus === s;
                            const count = s === 'ALL' ? bookings.length : bookings.filter(b => b.status === s).length;
                            return (
                                <button
                                    key={s}
                                    onClick={() => setFilterStatus(s)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 cursor-pointer border ${
                                        isActive 
                                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-transparent shadow-lg shadow-indigo-500/25' 
                                        : 'bg-gray-800/50 text-gray-400 border-gray-700 hover:bg-gray-700 hover:text-gray-200'
                                    }`}
                                >
                                    {s}
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                        isActive ? 'bg-white/20 text-white' : 'bg-gray-700 text-gray-300'
                                    }`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* ── Content ── */}
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="relative">
                                <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                                <div className="mt-4 text-gray-400 font-medium">Loading requests...</div>
                            </div>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-16 text-center transform transition-all duration-500 delay-200">
                            <div className="text-6xl mb-4 opacity-50">📭</div>
                            <p className="text-gray-400 text-lg font-medium">No booking requests found for <strong className="text-white">{filterStatus}</strong>.</p>
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
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Requested By</th>
                                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Attendees</th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700/50">
                                        {filtered.map((b, idx) => {
                                            const isPending = b.status === 'PENDING';
                                            return (
                                                <tr key={b.id} className={`transition-colors duration-200 ${isPending ? 'bg-indigo-900/10 hover:bg-indigo-900/20' : 'hover:bg-gray-700/30'}`}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="font-bold text-gray-100">{b.resourceId || '—'}</div>
                                                        <div className="text-gray-400 text-xs mt-1 max-w-[200px] overflow-hidden text-ellipsis" title={b.purpose}>
                                                            {b.purpose}
                                                        </div>
                                                        {b.adminReason && (
                                                            <div className="text-indigo-400 text-xs mt-1 italic">
                                                                Note: {b.adminReason}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {b.status === 'PENDING' && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-amber-500/10 text-amber-400 border-amber-500/30"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>PENDING</span>}
                                                        {b.status === 'APPROVED' && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-green-500/10 text-green-400 border-green-500/30"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>APPROVED</span>}
                                                        {b.status === 'REJECTED' && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-red-500/10 text-red-400 border-red-500/30"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>REJECTED</span>}
                                                        {b.status === 'CANCELLED' && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-gray-500/10 text-gray-400 border-gray-500/30"><span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>CANCELLED</span>}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="font-semibold text-gray-200 text-sm">{b.date || '—'}</div>
                                                        <div className="text-gray-500 text-xs">{b.startTime} – {b.endTime}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-gray-300 text-sm font-medium">{b.requestedBy || b.userId || '—'}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <div className="font-bold text-gray-400">{b.expectedAttendees ?? '—'}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <div className="flex justify-end gap-2">
                                                            {isPending && (
                                                                <>
                                                                    <button
                                                                        onClick={() => openReview(b.id, 'APPROVED')}
                                                                        className="px-3 py-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-bold transition-all cursor-pointer"
                                                                    >✓ Approve</button>
                                                                    <button
                                                                        onClick={() => openReview(b.id, 'REJECTED')}
                                                                        className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold transition-all cursor-pointer"
                                                                    >✕ Reject</button>
                                                                </>
                                                            )}
                                                            <button
                                                                onClick={() => handleDelete(b.id)}
                                                                className="px-3 py-1.5 rounded-lg bg-gray-700/50 hover:bg-gray-700 border border-gray-600 text-gray-300 text-xs font-bold transition-all cursor-pointer"
                                                            >🗑 Delete</button>
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

                    {/* Stats summary */}
                    {!loading && bookings.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 transform transition-all duration-500 delay-300 translate-y-0 opacity-100">
                            {['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map(s => {
                                const cnt = bookings.filter(b => b.status === s).length;
                                let borderColor = '';
                                if (s === 'PENDING') borderColor = 'border-amber-500/50';
                                else if (s === 'APPROVED') borderColor = 'border-green-500/50';
                                else if (s === 'REJECTED') borderColor = 'border-red-500/50';
                                else borderColor = 'border-gray-500/50';

                                return (
                                    <div key={s} className={`bg-gray-800/30 backdrop-blur-sm rounded-2xl p-5 text-center border border-gray-700 border-t-4 ${borderColor} shadow-lg`}>
                                        <div className="text-3xl font-bold text-white mb-1">{cnt}</div>
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{s}</div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ── Review Modal ── */}
                {reviewModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setReviewModal(null)}></div>
                        <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 relative z-10 border border-gray-700" style={{ animation: 'modalPopIn 0.25s ease-out' }}>
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner ${
                                    reviewModal.action === 'APPROVED' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                }`}>
                                    {reviewModal.action === 'APPROVED' ? '✓' : '✕'}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">
                                        {reviewModal.action === 'APPROVED' ? 'Approve Booking' : 'Reject Booking'}
                                    </h2>
                                    <p className="text-sm text-gray-400 mt-1">Provide a reason for this decision</p>
                                </div>
                            </div>

                            <textarea
                                value={reviewReason}
                                onChange={e => setReviewReason(e.target.value)}
                                placeholder={`Reason for ${reviewModal.action === 'APPROVED' ? 'approval' : 'rejection'}...`}
                                rows={4}
                                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 text-white rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all mb-6 resize-y"
                            />

                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setReviewModal(null)}
                                    disabled={actionLoading}
                                    className="px-5 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-medium transition-all cursor-pointer"
                                >Cancel</button>
                                <button
                                    onClick={submitReview}
                                    disabled={actionLoading}
                                    className={`px-5 py-2.5 rounded-xl text-white font-bold transition-all shadow-lg cursor-pointer ${
                                        reviewModal.action === 'APPROVED'
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 shadow-green-500/25'
                                        : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 shadow-red-500/25'
                                    } ${actionLoading ? 'opacity-70 cursor-wait' : ''}`}
                                >
                                    {actionLoading ? 'Processing...' : reviewModal.action === 'APPROVED' ? 'Confirm Approval' : 'Confirm Rejection'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes modalPopIn {
                    0% { opacity: 0; transform: scale(0.95) translateY(10px); }
                    100% { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </div>
    );
}
