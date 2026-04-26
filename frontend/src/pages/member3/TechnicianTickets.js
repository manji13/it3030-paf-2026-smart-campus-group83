import React, { useState, useEffect, useCallback } from 'react';
import TechnicianNav from '../../components/TechnicianNav';
import CommentSection from '../member3/CommentSection';

const BASE_URL = 'http://localhost:8000';

const STATUS_COLORS = {
    OPEN:        'bg-blue-100 text-blue-700',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
    RESOLVED:    'bg-green-100 text-green-700',
    CLOSED:      'bg-gray-200 text-gray-600',
    REJECTED:    'bg-red-100 text-red-600',
};
const PRIORITY_COLORS = {
    HIGH:   'bg-red-100 text-red-600',
    MEDIUM: 'bg-yellow-100 text-yellow-600',
    LOW:    'bg-green-100 text-green-600',
};

const STATUS_FLOW = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'];

export default function TechnicianTickets() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const techEmail = user.email || '';
    const techName  = user.name  || user.email || 'Technician';

    const [tickets, setTickets]         = useState([]);
    const [loading, setLoading]         = useState(true);
    const [selectedTicket, setSelected] = useState(null);
    const [searchText, setSearchText]   = useState('');
    const [filterStatus, setFilter]     = useState('ALL');

    // ── Fetch (shared by initial load + polling + post-update refresh) ────────
    const fetchTickets = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const res  = await fetch(`${BASE_URL}/api/tickets`);
            const data = await res.json();
            const mine = data.filter(t => t.assignedToEmail === techEmail);
            mine.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setTickets(mine);
            // Keep the right panel ticket up-to-date
            setSelected(prev => {
                if (!prev) return null;
                const fresh = mine.find(t => t.id === prev.id);
                return fresh || prev;
            });
        } catch (_) {}
        finally { if (!silent) setLoading(false); }
    }, [techEmail]);

    // Initial load
    useEffect(() => { fetchTickets(); }, [techEmail]);

    // Auto-poll every 30s
    useEffect(() => {
        const iv = setInterval(() => fetchTickets(true), 30000);
        return () => clearInterval(iv);
    }, [fetchTickets]);

    const filtered = tickets.filter(t => {
        const matchStatus = filterStatus === 'ALL' || t.status === filterStatus;
        const q = searchText.toLowerCase();
        const matchSearch = !q
            || (t.resource && t.resource.toLowerCase().includes(q))
            || (t.userEmail && t.userEmail.toLowerCase().includes(q))
            || (t.category && t.category.toLowerCase().includes(q));
        return matchStatus && matchSearch;
    });

    return (
        <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
            <TechnicianNav />

            <div className="flex flex-1 overflow-hidden">

                {/* LEFT PANEL */}
                <div className="w-full max-w-sm border-r border-gray-200 bg-white flex flex-col flex-shrink-0">

                    <div className="p-4 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-teal-700 mb-3">My Assigned Tickets</h2>
                        <input
                            placeholder="Search resource, email..."
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 mb-3"
                        />
                        <div className="flex gap-1 flex-wrap">
                            {['ALL', ...STATUS_FLOW].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setFilter(s)}
                                    className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                                        filterStatus === s ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                    }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <p className="text-center text-gray-400 text-sm py-10">Loading...</p>
                        ) : filtered.length === 0 ? (
                            <p className="text-center text-gray-400 text-sm py-10">No tickets assigned to you yet.</p>
                        ) : (
                            filtered.map(ticket => {
                                const isSelected  = selectedTicket?.id === ticket.id;
                                const statusColor = STATUS_COLORS[ticket.status] || 'bg-gray-100 text-gray-500';
                                const dateStr = ticket.createdAt
                                    ? new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                    : '';
                                return (
                                    <div
                                        key={ticket.id}
                                        onClick={() => setSelected(ticket)}
                                        className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                                            isSelected ? 'bg-teal-50 border-l-4 border-l-teal-600' : 'hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex justify-between items-center mb-0.5">
                                            <span className="text-xs font-semibold text-gray-700 truncate max-w-[150px]">{ticket.userEmail || 'Unknown'}</span>
                                            <span className="text-xs text-gray-400 ml-2">{dateStr}</span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-800 truncate">{ticket.resource}</p>
                                        <div className="flex justify-between items-center mt-1">
                                            <p className="text-xs text-gray-400 truncate">{ticket.category}</p>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ml-2 ${statusColor}`}>{ticket.status}</span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <div className="p-3 border-t border-gray-100 text-xs text-gray-400 text-center">
                        {filtered.length} of {tickets.length} tickets
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="flex-1 overflow-hidden">
                    {selectedTicket ? (
                        <TicketView
                            ticket={selectedTicket}
                            techEmail={techEmail}
                            techName={techName}
                            onRefresh={() => fetchTickets(true)}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <p className="text-4xl mb-3">🔧</p>
                            <p className="text-base font-medium">Select a ticket to view details</p>
                            <p className="text-sm mt-1">Click any ticket from the list</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Status updater (only for the assigned technician) ──────────────────────
function StatusUpdater({ ticket, techEmail, techName, onRefresh }) {
    const [open, setOpen]           = useState(false);
    const [newStatus, setNewStatus] = useState(ticket.status);
    const [notes, setNotes]         = useState(ticket.resolutionNotes || '');
    const [reason, setReason]       = useState(ticket.rejectionReason || '');
    const [saving, setSaving]       = useState(false);
    const [savedMsg, setSavedMsg]   = useState('');

    const handleSave = async () => {
        setSaving(true);
        try {
            const body = {
                status:          newStatus,
                assignedTo:      ticket.assignedTo   || techName,
                assignedToEmail: ticket.assignedToEmail || techEmail,
                resolutionNotes: notes,
                rejectionReason: reason,
            };
            const res = await fetch(`${BASE_URL}/api/tickets/${ticket.id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (!res.ok) throw new Error('Failed to update status');
            setSavedMsg(`Status updated to ${newStatus}`);
            setOpen(false);
            onRefresh();          // refresh list + right panel
            setTimeout(() => setSavedMsg(''), 3000);
        } catch (err) {
            alert(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="mb-4">
            {savedMsg && (
                <div className="mb-2 p-2 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700 font-medium">
                    ✅ {savedMsg}
                </div>
            )}

            {!open ? (
                <button
                    onClick={() => { setOpen(true); setNewStatus(ticket.status); setNotes(ticket.resolutionNotes || ''); setReason(ticket.rejectionReason || ''); }}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Update Status
                </button>
            ) : (
                <div className="border border-teal-200 bg-teal-50 rounded-xl p-4 flex flex-col gap-3">
                    <p className="text-xs font-semibold text-teal-700 uppercase tracking-wide">Update Ticket Status</p>

                    {/* Status dropdown */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 mb-1 block">New Status</label>
                        <select
                            value={newStatus}
                            onChange={e => setNewStatus(e.target.value)}
                            className="w-full p-2 border border-teal-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 bg-white"
                        >
                            {STATUS_FLOW.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    {/* Resolution notes */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 mb-1 block">Resolution Notes</label>
                        <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Describe the resolution..."
                            className="w-full p-2 border border-gray-200 rounded-lg text-sm min-h-[60px] resize-none focus:outline-none focus:ring-2 focus:ring-teal-200 bg-white"
                        />
                    </div>

                    {/* Rejection reason (only for REJECTED) */}
                    {newStatus === 'REJECTED' && (
                        <div>
                            <label className="text-xs font-semibold text-red-500 mb-1 block">Rejection Reason *</label>
                            <textarea
                                value={reason}
                                onChange={e => setReason(e.target.value)}
                                placeholder="Reason for rejection..."
                                className="w-full p-2 border border-red-200 bg-red-50 rounded-lg text-sm min-h-[60px] resize-none focus:outline-none focus:ring-2 focus:ring-red-200"
                            />
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                        >
                            {saving ? 'Saving...' : 'Save Status'}
                        </button>
                        <button
                            onClick={() => setOpen(false)}
                            className="px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Ticket detail view ──────────────────────────────────────────────────────
function TicketView({ ticket, techEmail, techName, onRefresh }) {
    const statusColor   = STATUS_COLORS[ticket.status]    || 'bg-gray-100 text-gray-500';
    const priorityColor = PRIORITY_COLORS[ticket.priority] || 'bg-gray-100 text-gray-500';
    const dateStr = ticket.createdAt
        ? new Date(ticket.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })
        : '';

    return (
        <div className="h-full overflow-y-auto p-6">

            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">{ticket.resource}</h2>
                    <p className="text-sm text-gray-400 mt-1">{ticket.category} · {ticket.location}</p>
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${statusColor}`}>{ticket.status}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColor}`}>{ticket.priority}</span>
                </div>
            </div>

            {/* Submitter */}
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold">
                    {ticket.userEmail ? ticket.userEmail[0].toUpperCase() : '?'}
                </div>
                <div>
                    <p className="text-xs font-semibold text-gray-700">{ticket.userEmail || 'Unknown'}</p>
                    <p className="text-xs text-gray-400">{dateStr}</p>
                </div>
            </div>

            {/* Description */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Description</p>
                <p className="text-sm text-gray-700 leading-relaxed">{ticket.description}</p>
            </div>

            {/* Contact */}
            <div className="mb-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Contact</p>
                <p className="text-sm text-gray-600">{ticket.contactDetails}</p>
            </div>

            {/* Assigned to (read-only badge) */}
            <div className="mb-4 p-3 bg-teal-50 border border-teal-100 rounded-xl">
                <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-1">Assigned To (You)</p>
                <p className="text-sm text-teal-700 font-medium">{ticket.assignedTo || techName}</p>
            </div>

            {/* Resolution Notes */}
            {ticket.resolutionNotes && (
                <div className="mb-4 bg-green-50 border border-green-100 rounded-xl p-3">
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Resolution</p>
                    <p className="text-sm text-green-700">{ticket.resolutionNotes}</p>
                </div>
            )}

            {/* Rejection Reason */}
            {ticket.rejectionReason && (
                <div className="mb-4 bg-red-50 border border-red-100 rounded-xl p-3">
                    <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-1">Rejection Reason</p>
                    <p className="text-sm text-red-600">{ticket.rejectionReason}</p>
                </div>
            )}

            {/* Attachments */}
            {ticket.imageUrls && ticket.imageUrls.length > 0 && (
                <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Attachments</p>
                    <div className="flex gap-2 flex-wrap">
                        {ticket.imageUrls.map((url, i) => (
                            <a key={i} href={`${BASE_URL}${url}`} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={`${BASE_URL}${url}`}
                                    alt={`attachment-${i}`}
                                    className="w-24 h-24 object-cover rounded-lg border border-gray-200 hover:opacity-80 transition"
                                />
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* ── STATUS UPDATE (technician only) ── */}
            <StatusUpdater
                ticket={ticket}
                techEmail={techEmail}
                techName={techName}
                onRefresh={onRefresh}
            />

            {/* Comments */}
            <CommentSection
                ticketId={ticket.id}
                currentEmail={techEmail}
                currentName={techName}
                isAdmin={true}
                assignedTechEmail={techEmail}
                assignedTechName={techName}
            />
        </div>
    );
}
