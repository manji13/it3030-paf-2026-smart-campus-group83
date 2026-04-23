import React, { useEffect, useState } from 'react';
import CommentSection from '../member3/CommentSection';
import AdminNav from '../../components/AdminNav';

const STATUS_FLOW = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'];

const STATUS_STYLES = {
  OPEN:        { pill: 'bg-blue-500/20 text-blue-300 border-blue-500/30',     dot: 'bg-blue-400' },
  IN_PROGRESS: { pill: 'bg-amber-500/20 text-amber-300 border-amber-500/30',  dot: 'bg-amber-400' },
  RESOLVED:    { pill: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', dot: 'bg-emerald-400' },
  CLOSED:      { pill: 'bg-gray-500/20 text-gray-400 border-gray-500/30',     dot: 'bg-gray-400' },
  REJECTED:    { pill: 'bg-red-500/20 text-red-300 border-red-500/30',        dot: 'bg-red-400' },
};

const PRIORITY_STYLES = {
  HIGH:   'bg-red-500/20 text-red-300 border-red-500/30',
  MEDIUM: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  LOW:    'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
};

const BASE_URL = 'http://localhost:8000';

/* ── sub-components ─────────────────────────────────────────────────── */

function ImageCard({ url }) {
  const full = BASE_URL + url;
  return (
    <a href={full} target="_blank" rel="noopener noreferrer">
      <img src={full} alt="attachment"
        className="w-20 h-20 object-cover rounded-xl border border-gray-700 hover:opacity-80 transition cursor-pointer shadow"
        onError={e => e.target.style.display = 'none'} />
    </a>
  );
}

function StatusEditor({ statusForm, setStatusForm, ticketId, onSave, onCancel, adminUsers = [] }) {
  return (
    <div className="mt-4 border-t border-gray-700 pt-4 flex flex-col gap-3">
      <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">Assign Technician</p>

      <div>
        <label className="text-xs text-gray-400 mb-1 block font-semibold uppercase tracking-wide">Select Technician</label>
        <select
          value={statusForm.assignedToEmail}
          onChange={e => {
            const sel = adminUsers.find(u => u.email === e.target.value);
            setStatusForm({ ...statusForm, assignedTo: sel ? (sel.name || sel.email) : '', assignedToEmail: e.target.value });
          }}
          className="w-full p-2.5 bg-gray-700/60 border border-gray-600 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">— Select technician —</option>
          {adminUsers.map(u => (
            <option key={u.id} value={u.email}>{u.name || u.email} ({u.email})</option>
          ))}
        </select>
        {statusForm.assignedTo && (
          <p className="text-xs text-indigo-400 mt-1.5">
            Will assign to: <strong className="text-indigo-300">{statusForm.assignedTo}</strong>
          </p>
        )}
      </div>

      <div className="flex gap-2 mt-1">
        <button onClick={() => onSave(ticketId)}
          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow shadow-indigo-900/40 transition-all">
          Assign
        </button>
        <button onClick={onCancel}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl text-sm font-medium transition-all">
          Cancel
        </button>
      </div>
    </div>
  );
}

function TicketDetail({ ticket, adminEmail, adminName, adminUsers, editingId, statusForm, setStatusForm, onEdit, onDelete, onSave, onCancel }) {
  const ss = STATUS_STYLES[ticket.status] || { pill: 'bg-gray-500/20 text-gray-400 border-gray-500/30', dot: 'bg-gray-400' };
  const ps = PRIORITY_STYLES[ticket.priority] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  const dateStr = ticket.createdAt
    ? new Date(ticket.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })
    : '';

  return (
    <div className="h-full overflow-y-auto p-6">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
        <div>
          <h2 className="text-xl font-bold text-white">{ticket.resource}</h2>
          <p className="text-sm text-gray-400 mt-1">{ticket.category}{ticket.location ? ` · ${ticket.location}` : ''}</p>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${ss.pill}`}>{ticket.status}</span>
          {ticket.priority && <span className={`text-xs px-2 py-1 rounded-full font-medium border ${ps}`}>{ticket.priority}</span>}
        </div>
      </div>

      {/* Submitter */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow">
          {ticket.userEmail ? ticket.userEmail[0].toUpperCase() : '?'}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-200">{ticket.userEmail || 'Unknown'}</p>
          <p className="text-xs text-gray-500">{dateStr}</p>
        </div>
      </div>

      {/* Description */}
      <div className="bg-gray-700/40 border border-gray-600/40 rounded-xl p-4 mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Description</p>
        <p className="text-sm text-gray-300 leading-relaxed">{ticket.description}</p>
      </div>

      {/* Contact */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Contact</p>
        <p className="text-sm text-gray-300">{ticket.contactDetails}</p>
      </div>

      {/* Assigned To */}
      {ticket.assignedTo && (
        <div className="mb-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1">Assigned To</p>
          <p className="text-sm text-indigo-300 font-medium">{ticket.assignedTo}</p>
          {ticket.assignedToEmail && <p className="text-xs text-indigo-400 mt-0.5">{ticket.assignedToEmail}</p>}
        </div>
      )}

      {/* Resolution Notes */}
      {ticket.resolutionNotes && (
        <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-1">Resolution</p>
          <p className="text-sm text-emerald-300">{ticket.resolutionNotes}</p>
        </div>
      )}

      {/* Rejection Reason */}
      {ticket.rejectionReason && (
        <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
          <p className="text-xs font-semibold text-red-400 uppercase tracking-widest mb-1">Rejection Reason</p>
          <p className="text-sm text-red-300">{ticket.rejectionReason}</p>
        </div>
      )}

      {/* Attachments */}
      {ticket.imageUrls && ticket.imageUrls.length > 0 && (
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Attachments</p>
          <div className="flex gap-2 flex-wrap">
            {ticket.imageUrls.map((url, i) => <ImageCard key={i} url={url} />)}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => onEdit(ticket)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow shadow-indigo-900/40 transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
          </svg>
          Assign Technician
        </button>
        <button onClick={() => onDelete(ticket.id)}
          className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 px-4 py-2 rounded-xl text-sm font-medium transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
      </div>

      {/* Status Editor */}
      {editingId === ticket.id && (
        <StatusEditor ticketId={ticket.id} statusForm={statusForm} setStatusForm={setStatusForm}
          onSave={onSave} onCancel={onCancel} adminUsers={adminUsers} />
      )}

      {/* Comments */}
      <CommentSection ticketId={ticket.id} currentEmail={adminEmail} currentName={adminName}
        isAdmin={true} assignedTechEmail={ticket.assignedToEmail || ''} assignedTechName={ticket.assignedTo || ''} />
    </div>
  );
}

/* ── main ──────────────────────────────────────────────────────────── */
export default function TicketList() {
  const stored    = JSON.parse(localStorage.getItem('user') || '{}');
  const adminEmail = stored.email || '';
  const adminName  = stored.name  || stored.email || 'Admin';

  const [tickets,      setTickets]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [editingId,    setEditingId]    = useState(null);
  const [statusForm,   setStatusForm]   = useState({ status:'', assignedTo:'', assignedToEmail:'', resolutionNotes:'', rejectionReason:'' });
  const [adminUsers,   setAdminUsers]   = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchText,   setSearchText]   = useState('');

  function fetchTickets() {
    setLoading(true);
    fetch(BASE_URL + '/api/tickets')
      .then(r => { if (!r.ok) throw new Error('Failed'); return r.json(); })
      .then(data => {
        const sorted = data.sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt));
        setTickets(sorted);
        setLoading(false);
      })
      .catch(err => { setError(err.message); setLoading(false); });
  }

  useEffect(() => { fetchTickets(); }, []);

  // Auto-poll every 30s
  useEffect(() => {
    const iv = setInterval(() => {
      fetch(BASE_URL + '/api/tickets').then(r=>r.json()).then(data => {
        const sorted = data.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
        setTickets(sorted);
        setSelectedTicket(prev => prev ? (sorted.find(t=>t.id===prev.id)||prev) : null);
      }).catch(()=>{});
    }, 30000);
    return () => clearInterval(iv);
  }, []);

  // Fetch technicians
  useEffect(() => {
    fetch(BASE_URL + '/api/users/technicians').then(r=>r.json()).then(setAdminUsers).catch(()=>{});
  }, []);

  function openEdit(ticket) {
    setEditingId(ticket.id);
    setStatusForm({ status: ticket.status, assignedTo: ticket.assignedTo||'', assignedToEmail: ticket.assignedToEmail||'', resolutionNotes: ticket.resolutionNotes||'', rejectionReason: ticket.rejectionReason||'' });
  }

  function handleStatusUpdate(id) {
    fetch(BASE_URL + '/api/tickets/' + id + '/status', {
      method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify(statusForm)
    }).then(r => { if(!r.ok) throw new Error('Update failed'); setEditingId(null); fetchTickets(); })
      .catch(err => alert(err.message));
  }

  function handleDelete(id) {
    if (!window.confirm('Delete this ticket?')) return;
    fetch(BASE_URL + '/api/tickets/' + id, { method:'DELETE' })
      .then(() => { setSelectedTicket(null); fetchTickets(); });
  }

  const filtered = tickets.filter(t => {
    const matchStatus = filterStatus === 'ALL' || t.status === filterStatus;
    const q = searchText.toLowerCase();
    const matchSearch = !q || (t.resource&&t.resource.toLowerCase().includes(q)) ||
      (t.userEmail&&t.userEmail.toLowerCase().includes(q)) || (t.category&&t.category.toLowerCase().includes(q));
    return matchStatus && matchSearch;
  });

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900 overflow-hidden">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-indigo-700 rounded-full filter blur-3xl opacity-10 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-700 rounded-full filter blur-3xl opacity-10 animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 overflow-hidden">
        <AdminNav />

        {loading ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-4">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-900/40" />
              <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin" />
            </div>
            <p className="text-gray-400 text-sm">Loading tickets…</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center flex-1">
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-red-400 text-sm">{error}</div>
          </div>
        ) : (
          <div className="flex flex-1 overflow-hidden">

            {/* ── LEFT PANEL ──────────────────────────────────────── */}
            <div className="w-full max-w-[320px] flex flex-col flex-shrink-0 border-r border-gray-700/50 bg-gray-900/60 backdrop-blur-sm">

              {/* Header */}
              <div className="p-4 border-b border-gray-700/50">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  <h2 className="text-base font-bold text-white">All Tickets</h2>
                  <span className="ml-auto text-xs font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                    {filtered.length}
                  </span>
                </div>

                {/* Search */}
                <div className="relative mb-3">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    placeholder="Search resource, email…"
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>

                {/* Filter pills */}
                <div className="flex gap-1.5 flex-wrap">
                  {['ALL', ...STATUS_FLOW].map(s => (
                    <button key={s} onClick={() => setFilterStatus(s)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                        filterStatus === s
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                          : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/60 hover:text-gray-200'
                      }`}>
                      {s === 'IN_PROGRESS' ? 'IN PROG' : s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ticket rows */}
              <div className="overflow-y-auto flex-1">
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-2 text-gray-600">
                    <span className="text-3xl">📋</span>
                    <p className="text-sm">No tickets found</p>
                  </div>
                ) : filtered.map(ticket => {
                  const isSelected = selectedTicket?.id === ticket.id;
                  const ss = STATUS_STYLES[ticket.status] || { pill:'', dot:'bg-gray-400' };
                  const dateStr = ticket.createdAt
                    ? new Date(ticket.createdAt).toLocaleDateString('en-US', { month:'short', day:'numeric' })
                    : '';

                  return (
                    <div key={ticket.id}
                      onClick={() => { setSelectedTicket(ticket); setEditingId(null); }}
                      className={`px-4 py-3.5 border-b border-gray-700/40 cursor-pointer transition-all duration-150 relative ${
                        isSelected
                          ? 'bg-indigo-600/10 border-l-2 border-l-indigo-500'
                          : 'hover:bg-gray-800/60 border-l-2 border-l-transparent'
                      }`}>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-semibold text-gray-300 truncate max-w-[160px]">
                          {ticket.userEmail || 'Unknown'}
                        </span>
                        <span className="text-[11px] text-gray-500 flex-shrink-0 ml-2">{dateStr}</span>
                      </div>
                      <p className="text-sm font-medium text-white truncate">{ticket.resource}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <p className="text-xs text-gray-500 truncate">{ticket.category}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ml-2 flex items-center gap-1 ${ss.pill}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${ss.dot}`} />
                          {ticket.status}
                        </span>
                      </div>
                      {ticket.assignedTo && (
                        <p className="text-[10px] text-indigo-400 mt-1 truncate">🔧 {ticket.assignedTo}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-gray-700/50 text-xs text-gray-500 text-center">
                {filtered.length} of {tickets.length} tickets
              </div>
            </div>

            {/* ── RIGHT PANEL ─────────────────────────────────────── */}
            <div className="flex-1 overflow-hidden bg-gray-900/40 backdrop-blur-sm">
              {selectedTicket ? (
                <TicketDetail
                  ticket={selectedTicket}
                  adminEmail={adminEmail}
                  adminName={adminName}
                  adminUsers={adminUsers}
                  editingId={editingId}
                  statusForm={statusForm}
                  setStatusForm={setStatusForm}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  onSave={handleStatusUpdate}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-600">
                  <div className="w-20 h-20 rounded-2xl bg-gray-800/60 border border-gray-700/50 flex items-center justify-center text-4xl">📋</div>
                  <div className="text-center">
                    <p className="text-base font-semibold text-gray-400">Select a ticket</p>
                    <p className="text-sm text-gray-600 mt-1">Click any ticket from the list to view details</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
