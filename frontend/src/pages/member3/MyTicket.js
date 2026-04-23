import React, { useEffect, useState } from 'react';
import CommentSection from './CommentSection';
import UserNav from '../../components/UserNav';

const BASE_URL = 'http://localhost:8000';

const STATUS_STYLES = {
  OPEN:        { pill:'bg-blue-500/15 text-blue-600 border-blue-200',         dot:'bg-blue-500',    label:'Open' },
  IN_PROGRESS: { pill:'bg-amber-500/15 text-amber-600 border-amber-200',      dot:'bg-amber-500',   label:'In Progress' },
  RESOLVED:    { pill:'bg-emerald-500/15 text-emerald-600 border-emerald-200', dot:'bg-emerald-500', label:'Resolved' },
  CLOSED:      { pill:'bg-gray-200 text-gray-500 border-gray-200',            dot:'bg-gray-400',    label:'Closed' },
  REJECTED:    { pill:'bg-red-500/15 text-red-600 border-red-200',            dot:'bg-red-500',     label:'Rejected' },
};

const PRIORITY_STYLES = {
  HIGH:   'bg-red-50 text-red-600 border-red-200',
  MEDIUM: 'bg-amber-50 text-amber-600 border-amber-200',
  LOW:    'bg-emerald-50 text-emerald-600 border-emerald-200',
};

function timeAgo(str) {
  const d = Math.floor((Date.now() - new Date(str)) / 86400000);
  if (d === 0) return 'Today';
  if (d === 1) return 'Yesterday';
  return `${d}d ago`;
}

function ImageCard({ url }) {
  const full = BASE_URL + url;
  return (
    <a href={full} target="_blank" rel="noopener noreferrer">
      <img src={full} alt="attachment"
        className="w-20 h-20 object-cover rounded-xl border border-indigo-100 hover:opacity-80 transition cursor-pointer shadow-sm"
        onError={e => e.target.style.display = 'none'} />
    </a>
  );
}

function TicketCard({ ticket, userEmail, userName }) {
  const ss = STATUS_STYLES[ticket.status] || { pill:'bg-gray-100 text-gray-500 border-gray-200', dot:'bg-gray-400', label: ticket.status };
  const ps = PRIORITY_STYLES[ticket.priority] || 'bg-gray-100 text-gray-500 border-gray-200';
  const dateStr = ticket.createdAt
    ? new Date(ticket.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' })
    : '';

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/60 dark:border-gray-700/50 rounded-2xl shadow-sm shadow-indigo-100/30 hover:shadow-md hover:shadow-indigo-100/50 transition-all duration-200 overflow-hidden">

      {/* Top colour bar */}
      <div className={`h-1 w-full ${
        ticket.status === 'OPEN'        ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
        ticket.status === 'IN_PROGRESS' ? 'bg-gradient-to-r from-amber-400 to-amber-600' :
        ticket.status === 'RESOLVED'    ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' :
        ticket.status === 'REJECTED'    ? 'bg-gradient-to-r from-red-400 to-red-600' :
                                          'bg-gradient-to-r from-gray-300 to-gray-400'
      }`} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 dark:text-white text-base leading-snug truncate">{ticket.resource}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{ticket.category}{ticket.location ? ` · ${ticket.location}` : ''}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border flex items-center gap-1.5 ${ss.pill}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${ss.dot}`} />
              {ss.label}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">{ticket.description}</p>

        {/* Meta chips */}
        <div className="flex flex-wrap gap-2 mt-4">
          {ticket.priority && (
            <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold border ${ps}`}>
              {ticket.priority === 'HIGH' ? '🔴' : ticket.priority === 'MEDIUM' ? '🟡' : '🟢'} {ticket.priority}
            </span>
          )}
          {ticket.assignedTo && (
            <span className="text-[11px] px-2.5 py-1 rounded-full font-medium bg-indigo-50 text-indigo-600 border border-indigo-100">
              🔧 {ticket.assignedTo}
            </span>
          )}
          {dateStr && (
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-gray-50 text-gray-400 border border-gray-100">
              📅 {dateStr}
            </span>
          )}
          {ticket.contactDetails && (
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-gray-50 text-gray-400 border border-gray-100 truncate max-w-[180px]">
              📧 {ticket.contactDetails}
            </span>
          )}
        </div>

        {/* Resolution Notes */}
        {ticket.resolutionNotes && (
          <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-xs text-emerald-700">
            <p className="font-semibold uppercase tracking-wide text-emerald-600 mb-1 text-[10px]">✅ Resolution</p>
            {ticket.resolutionNotes}
          </div>
        )}

        {/* Rejection Reason */}
        {ticket.rejectionReason && (
          <div className="mt-4 bg-red-50 border border-red-100 rounded-xl p-3 text-xs text-red-600">
            <p className="font-semibold uppercase tracking-wide text-red-500 mb-1 text-[10px]">❌ Rejection Reason</p>
            {ticket.rejectionReason}
          </div>
        )}

        {/* Attachments */}
        {ticket.imageUrls && ticket.imageUrls.length > 0 && (
          <div className="mt-4">
            <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide mb-2">Attachments</p>
            <div className="flex gap-2 flex-wrap">
              {ticket.imageUrls.map((url, i) => <ImageCard key={i} url={url} />)}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-100 dark:border-gray-700 mt-4 pt-4">
          <CommentSection
            ticketId={ticket.id}
            currentEmail={userEmail}
            currentName={userName}
            isAdmin={false}
          />
        </div>
      </div>
    </div>
  );
}

export default function MyTickets() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userEmail = user.email || '';
  const userName  = user.name  || user.email || 'User';

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [filter,  setFilter]  = useState('ALL');

  useEffect(() => {
    if (!userEmail) { setError('You are not logged in.'); setLoading(false); return; }
    fetch(`${BASE_URL}/api/tickets/my?email=${encodeURIComponent(userEmail)}`)
      .then(r => { if (!r.ok) throw new Error('Failed to fetch tickets'); return r.json(); })
      .then(data => { setTickets(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [userEmail]);

  const STATUSES = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'];
  const displayed = filter === 'ALL' ? tickets : tickets.filter(t => t.status === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-purple-50 dark:bg-gray-900">
      <UserNav />

      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-200 rounded-full filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-0 -left-24 w-80 h-80 bg-purple-200 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-10">

        {/* Page header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">My Tickets</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              <span className="text-indigo-500 font-semibold">{userEmail}</span>
              {' · '}
              <span className="font-semibold text-purple-500">{tickets.length} ticket{tickets.length !== 1 ? 's' : ''}</span>
            </p>
          </div>
          {tickets.length > 0 && (
            <div className="ml-auto hidden sm:flex gap-2">
              <span className="text-xs bg-indigo-100 text-indigo-600 px-2.5 py-1 rounded-full font-semibold border border-indigo-200">
                {tickets.filter(t=>t.status==='OPEN').length} Open
              </span>
              <span className="text-xs bg-emerald-100 text-emerald-600 px-2.5 py-1 rounded-full font-semibold border border-emerald-200">
                {tickets.filter(t=>t.status==='RESOLVED').length} Resolved
              </span>
            </div>
          )}
        </div>

        {/* Filter pills */}
        {tickets.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mb-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-2 shadow-sm">
            {STATUSES.map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  filter === s
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400'
                }`}>
                {s === 'IN_PROGRESS' ? 'IN PROG' : s}
                {s !== 'ALL' && <span className="ml-1 opacity-60">{tickets.filter(t=>t.status===s).length}</span>}
              </button>
            ))}
          </div>
        )}

        {/* States */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
              <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin" />
            </div>
            <p className="text-gray-400 text-sm font-medium">Loading your tickets…</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center text-red-500 text-sm">{error}</div>
        ) : displayed.length === 0 ? (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/60 dark:border-gray-700 rounded-3xl shadow-sm p-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <p className="text-base font-bold text-gray-800 dark:text-gray-200">
              {filter === 'ALL' ? 'No tickets yet' : `No ${filter} tickets`}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {filter === 'ALL' ? 'Submit your first ticket and it will appear here.' : 'Try a different status filter.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {displayed.map(ticket => (
              <TicketCard key={ticket.id} ticket={ticket} userEmail={userEmail} userName={userName} />
            ))}
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-8">
          Showing {displayed.length} of {tickets.length} ticket{tickets.length !== 1 ? 's' : ''}
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `.line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}` }} />
    </div>
  );
}