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
        const userStr = localStorage.getItem('user');
        if (!userStr) { navigate('/login'); return; }
        const user = JSON.parse(userStr);
        if ((user.role || '').toUpperCase() !== 'ADMIN') { navigate('/admin-page'); return; }
        setUserName(user.name  || '');
        setUserEmail(user.email || '');
    }, [navigate]);

    /* ── Fetch bookings ── */
    const fetchBookings = useCallback(async () => {
        try {
            setLoading(true);
            const res = await bookingService.getAllBookings();
            setBookings(res.data || []);
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
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%)', fontFamily: "'Inter', sans-serif" }}>
            {/* Google Font */}
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

            <AdminNav userName={userName} userEmail={userEmail} onLogout={handleLogout} />

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>

                {/* ── Header ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '44px', height: '44px',
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(99,102,241,0.35)'
                            }}>
                                <svg width="22" height="22" fill="none" stroke="white" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800, color: '#1e1b4b' }}>Booking Requests</h1>
                                <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Review and manage all campus facility bookings</p>
                            </div>
                        </div>
                    </div>

                    {pendingCount > 0 && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: '#fffbeb', border: '1px solid #fcd34d',
                            borderRadius: '10px', padding: '10px 18px'
                        }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', animation: 'pulse 2s infinite' }} />
                            <span style={{ fontWeight: 700, color: '#92400e', fontSize: '14px' }}>
                                {pendingCount} pending {pendingCount === 1 ? 'request' : 'requests'} awaiting review
                            </span>
                        </div>
                    )}
                </div>

                {/* ── Filter Tabs ── */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                    {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map(s => {
                        const isActive = filterStatus === s;
                        const count = s === 'ALL' ? bookings.length : bookings.filter(b => b.status === s).length;
                        return (
                            <button
                                key={s}
                                onClick={() => setFilterStatus(s)}
                                style={{
                                    padding: '8px 18px',
                                    borderRadius: '999px',
                                    border: isActive ? '2px solid #6366f1' : '1px solid #e5e7eb',
                                    background: isActive ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'white',
                                    color: isActive ? 'white' : '#4b5563',
                                    fontWeight: 600,
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    boxShadow: isActive ? '0 4px 12px rgba(99,102,241,0.35)' : '0 1px 3px rgba(0,0,0,0.07)',
                                    display: 'flex', alignItems: 'center', gap: '6px'
                                }}
                            >
                                {s}
                                <span style={{
                                    background: isActive ? 'rgba(255,255,255,0.25)' : '#f3f4f6',
                                    color: isActive ? 'white' : '#6b7280',
                                    borderRadius: '999px', padding: '1px 7px', fontSize: '11px', fontWeight: 700
                                }}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* ── Content ── */}
                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '16px' }}>
                        <div style={{ width: '48px', height: '48px', border: '4px solid #e0e7ff', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        <p style={{ color: '#6b7280', fontWeight: 500 }}>Loading booking requests…</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{
                        background: 'white', borderRadius: '16px', padding: '60px 40px',
                        textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
                    }}>
                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
                        <p style={{ color: '#6b7280', fontSize: '16px', fontWeight: 500 }}>No booking requests found for <strong>{filterStatus}</strong>.</p>
                    </div>
                ) : (
                    <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                        {/* Table header */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 130px 200px 150px 90px 180px',
                            padding: '14px 24px',
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            color: 'white', fontWeight: 700, fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase'
                        }}>
                            <span>Resource / Purpose</span>
                            <span>Status</span>
                            <span>Date &amp; Time</span>
                            <span>Requested By</span>
                            <span style={{ textAlign: 'center' }}>Attendees</span>
                            <span style={{ textAlign: 'right' }}>Actions</span>
                        </div>

                        {filtered.map((b, idx) => {
                            const sc = STATUS_COLORS[b.status] || STATUS_COLORS.CANCELLED;
                            return (
                                <div
                                    key={b.id}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 130px 200px 150px 90px 180px',
                                        padding: '16px 24px',
                                        alignItems: 'center',
                                        borderBottom: idx < filtered.length - 1 ? '1px solid #f3f4f6' : 'none',
                                        background: b.status === 'PENDING' ? '#fffdf5' : 'white',
                                        transition: 'background 0.15s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#f8f9ff'}
                                    onMouseLeave={e => e.currentTarget.style.background = b.status === 'PENDING' ? '#fffdf5' : 'white'}
                                >
                                    {/* Resource / Purpose */}
                                    <div>
                                        <div style={{ fontWeight: 700, color: '#1e1b4b', fontSize: '15px' }}>
                                            {b.resourceId || '—'}
                                        </div>
                                        <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '3px', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={b.purpose}>
                                            {b.purpose}
                                        </div>
                                        {b.adminReason && (
                                            <div style={{ color: '#6366f1', fontSize: '11px', marginTop: '3px', fontStyle: 'italic' }}>
                                                Note: {b.adminReason}
                                            </div>
                                        )}
                                    </div>

                                    {/* Status badge */}
                                    <div>
                                        <span style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '5px',
                                            padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700,
                                            border: `1px solid`,
                                        }} className={`${sc.bg} ${sc.text} ${sc.border}`}>
                                            <span style={{ width: '7px', height: '7px', borderRadius: '50%' }} className={sc.dot} />
                                            {b.status}
                                        </span>
                                    </div>

                                    {/* Date & Time */}
                                    <div>
                                        <div style={{ fontWeight: 600, color: '#374151', fontSize: '13px' }}>{b.date || '—'}</div>
                                        <div style={{ color: '#9ca3af', fontSize: '12px' }}>{b.startTime} – {b.endTime}</div>
                                    </div>

                                    {/* Requested By */}
                                    <div style={{ color: '#374151', fontSize: '13px', fontWeight: 500 }}>
                                        {b.requestedBy || b.userId || '—'}
                                    </div>

                                    {/* Attendees */}
                                    <div style={{ textAlign: 'center', fontWeight: 700, color: '#4b5563', fontSize: '14px' }}>
                                        {b.expectedAttendees ?? '—'}
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', flexWrap: 'wrap' }}>
                                        {b.status === 'PENDING' && (
                                            <>
                                                <button
                                                    onClick={() => openReview(b.id, 'APPROVED')}
                                                    style={{
                                                        padding: '6px 12px', borderRadius: '8px', border: 'none',
                                                        background: '#d1fae5', color: '#065f46', fontWeight: 700, fontSize: '12px',
                                                        cursor: 'pointer', transition: 'all 0.15s'
                                                    }}
                                                    onMouseEnter={e => e.currentTarget.style.background = '#a7f3d0'}
                                                    onMouseLeave={e => e.currentTarget.style.background = '#d1fae5'}
                                                >✓ Approve</button>
                                                <button
                                                    onClick={() => openReview(b.id, 'REJECTED')}
                                                    style={{
                                                        padding: '6px 12px', borderRadius: '8px', border: 'none',
                                                        background: '#fee2e2', color: '#991b1b', fontWeight: 700, fontSize: '12px',
                                                        cursor: 'pointer', transition: 'all 0.15s'
                                                    }}
                                                    onMouseEnter={e => e.currentTarget.style.background = '#fecaca'}
                                                    onMouseLeave={e => e.currentTarget.style.background = '#fee2e2'}
                                                >✕ Reject</button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => handleDelete(b.id)}
                                            style={{
                                                padding: '6px 12px', borderRadius: '8px', border: 'none',
                                                background: '#f3f4f6', color: '#4b5563', fontWeight: 700, fontSize: '12px',
                                                cursor: 'pointer', transition: 'all 0.15s'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#e5e7eb'}
                                            onMouseLeave={e => e.currentTarget.style.background = '#f3f4f6'}
                                        >🗑 Delete</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Stats summary */}
                {!loading && bookings.length > 0 && (
                    <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
                        {['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map(s => {
                            const sc = STATUS_COLORS[s];
                            const cnt = bookings.filter(b => b.status === s).length;
                            return (
                                <div key={s} style={{
                                    flex: '1', minWidth: '120px', background: 'white',
                                    borderRadius: '12px', padding: '16px 20px', textAlign: 'center',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                    borderTop: `3px solid`
                                }} className={sc.border}>
                                    <div style={{ fontSize: '28px', fontWeight: 800, color: '#1e1b4b' }}>{cnt}</div>
                                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>{s}</div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── Review Modal ── */}
            {reviewModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        background: 'white', borderRadius: '20px', padding: '36px',
                        width: '440px', maxWidth: '90vw', boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
                        animation: 'slideUp 0.25s ease-out'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                                background: reviewModal.action === 'APPROVED' ? '#d1fae5' : '#fee2e2'
                            }}>
                                {reviewModal.action === 'APPROVED' ? '✓' : '✕'}
                            </div>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1e1b4b' }}>
                                    {reviewModal.action === 'APPROVED' ? 'Approve Booking' : 'Reject Booking'}
                                </h2>
                                <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>Provide a reason for this decision</p>
                            </div>
                        </div>

                        <textarea
                            value={reviewReason}
                            onChange={e => setReviewReason(e.target.value)}
                            placeholder={`Reason for ${reviewModal.action === 'APPROVED' ? 'approval' : 'rejection'}…`}
                            rows={4}
                            style={{
                                width: '100%', padding: '12px', borderRadius: '10px',
                                border: '1.5px solid #e5e7eb', fontSize: '14px', fontFamily: 'inherit',
                                resize: 'vertical', outline: 'none', boxSizing: 'border-box', marginBottom: '20px',
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={e => e.target.style.borderColor = '#6366f1'}
                            onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                        />

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setReviewModal(null)}
                                disabled={actionLoading}
                                style={{
                                    padding: '10px 20px', borderRadius: '10px', border: '1px solid #e5e7eb',
                                    background: 'white', color: '#374151', fontWeight: 600, fontSize: '14px', cursor: 'pointer'
                                }}
                            >Cancel</button>
                            <button
                                onClick={submitReview}
                                disabled={actionLoading}
                                style={{
                                    padding: '10px 24px', borderRadius: '10px', border: 'none',
                                    background: reviewModal.action === 'APPROVED'
                                        ? 'linear-gradient(135deg, #10b981, #059669)'
                                        : 'linear-gradient(135deg, #ef4444, #dc2626)',
                                    color: 'white', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                                    opacity: actionLoading ? 0.7 : 1
                                }}
                            >
                                {actionLoading ? 'Processing…' : reviewModal.action === 'APPROVED' ? 'Confirm Approval' : 'Confirm Rejection'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes spin    { to { transform: rotate(360deg); } }
                @keyframes pulse   { 0%,100% { opacity:1; } 50% { opacity:.4; } }
                @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
            `}</style>
        </div>
    );
}
