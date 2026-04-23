import React, { useEffect, useState } from 'react';
import CommentSection from '../member3/CommentSection';
import AdminNav from '../../components/AdminNav';

const STATUS_FLOW = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'];

const STATUS_COLORS = {
  OPEN: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
  RESOLVED: 'bg-green-100 text-green-700',
  CLOSED: 'bg-gray-200 text-gray-600',
  REJECTED: 'bg-red-100 text-red-600',
};

const PRIORITY_COLORS = {
  HIGH: 'bg-red-100 text-red-600',
  MEDIUM: 'bg-yellow-100 text-yellow-600',
  LOW: 'bg-green-100 text-green-600',
};

const BASE_URL = 'http://localhost:8000';

function ImageCard(props) {
  var fullUrl = BASE_URL + props.url;
  return (
    <a href={fullUrl} target="_blank" rel="noopener noreferrer">
      <img
        src={fullUrl}
        alt="attachment"
        className="w-20 h-20 object-cover rounded-xl border border-gray-200 hover:opacity-80 transition cursor-pointer shadow-sm"
        onError={function(e) { e.target.style.display = 'none'; }}
      />
    </a>
  );
}

function StatusEditor(props) {
  var statusForm = props.statusForm;
  var setStatusForm = props.setStatusForm;
  var ticketId = props.ticketId;
  var onSave = props.onSave;
  var onCancel = props.onCancel;

  return (
    <div className="mt-4 border-t pt-4 flex flex-col gap-2">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Update Status</p>
      <select
        value={statusForm.status}
        onChange={function(e) {
          var val = e.target.value;
          setStatusForm({ status: val, assignedTo: statusForm.assignedTo, resolutionNotes: statusForm.resolutionNotes, rejectionReason: statusForm.rejectionReason });
        }}
        className="p-2 border border-gray-300 rounded-lg text-sm"
      >
        {STATUS_FLOW.map(function(s) {
          return <option key={s} value={s}>{s}</option>;
        })}
      </select>

      <input
        placeholder="Assign to (technician name)"
        value={statusForm.assignedTo}
        onChange={function(e) {
          var val = e.target.value;
          setStatusForm({ status: statusForm.status, assignedTo: val, resolutionNotes: statusForm.resolutionNotes, rejectionReason: statusForm.rejectionReason });
        }}
        className="p-2 border border-gray-300 rounded-lg text-sm"
      />

      <textarea
        placeholder="Resolution notes"
        value={statusForm.resolutionNotes}
        onChange={function(e) {
          var val = e.target.value;
          setStatusForm({ status: statusForm.status, assignedTo: statusForm.assignedTo, resolutionNotes: val, rejectionReason: statusForm.rejectionReason });
        }}
        className="p-2 border border-gray-300 rounded-lg text-sm min-h-[60px]"
      />

      {statusForm.status === 'REJECTED' && (
        <textarea
          placeholder="Rejection reason *"
          value={statusForm.rejectionReason}
          onChange={function(e) {
            var val = e.target.value;
            setStatusForm({ status: statusForm.status, assignedTo: statusForm.assignedTo, resolutionNotes: statusForm.resolutionNotes, rejectionReason: val });
          }}
          className="p-2 border border-red-200 bg-red-50 rounded-lg text-sm min-h-[60px]"
        />
      )}

      <div className="flex gap-2">
        <button
          onClick={function() { onSave(ticketId); }}
          className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-indigo-700"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-lg text-sm hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function TicketDetail(props) {
  var ticket = props.ticket;
  var adminEmail = props.adminEmail;
  var adminName = props.adminName;
  var editingId = props.editingId;
  var statusForm = props.statusForm;
  var setStatusForm = props.setStatusForm;
  var onEdit = props.onEdit;
  var onDelete = props.onDelete;
  var onSave = props.onSave;
  var onCancel = props.onCancel;

  var statusColor = STATUS_COLORS[ticket.status] || 'bg-gray-100 text-gray-500';
  var priorityColor = PRIORITY_COLORS[ticket.priority] || 'bg-gray-100 text-gray-500';

  var dateStr = '';
  if (ticket.createdAt) {
    dateStr = new Date(ticket.createdAt).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  return (
    <div className="h-full overflow-y-auto p-6">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{ticket.resource}</h2>
          <p className="text-sm text-gray-400 mt-1">{ticket.category} · {ticket.location}</p>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <span className={'text-xs px-3 py-1 rounded-full font-semibold ' + statusColor}>
            {ticket.status}
          </span>
          <span className={'text-xs px-2 py-1 rounded-full font-medium ' + priorityColor}>
            {ticket.priority}
          </span>
        </div>
      </div>

      {/* Submitted by */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
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

      {/* Assigned to */}
      {ticket.assignedTo && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Assigned To</p>
          <p className="text-sm text-gray-600">{ticket.assignedTo}</p>
        </div>
      )}

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

      {/* Images */}
      {ticket.imageUrls && ticket.imageUrls.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Attachments</p>
          <div className="flex gap-2 flex-wrap">
            {ticket.imageUrls.map(function(url, i) {
              return <ImageCard key={i} url={url} />;
            })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={function() { onEdit(ticket); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"
        >
          Update Status
        </button>
        <button
          onClick={function() { onDelete(ticket.id); }}
          className="bg-red-50 text-red-500 border border-red-200 px-4 py-2 rounded-lg text-sm hover:bg-red-100"
        >
          Delete Ticket
        </button>
      </div>

      {/* Status Editor */}
      {editingId === ticket.id && (
        <StatusEditor
          ticketId={ticket.id}
          statusForm={statusForm}
          setStatusForm={setStatusForm}
          onSave={onSave}
          onCancel={onCancel}
        />
      )}

      {/* Comments */}
      <CommentSection
        ticketId={ticket.id}
        currentEmail={adminEmail}
        currentName={adminName}
        isAdmin={true}
      />

    </div>
  );
}

export default function TicketList() {
  var stored = localStorage.getItem('user') || '{}';
  var adminUser = JSON.parse(stored);
  var adminEmail = adminUser.email || '';
  var adminName = adminUser.name || adminUser.email || 'Admin';

  var ticketsState = useState([]);
  var tickets = ticketsState[0];
  var setTickets = ticketsState[1];

  var loadingState = useState(true);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  var errorState = useState('');
  var error = errorState[0];
  var setError = errorState[1];

  var selectedState = useState(null);
  var selectedTicket = selectedState[0];
  var setSelectedTicket = selectedState[1];

  var editingState = useState(null);
  var editingId = editingState[0];
  var setEditingId = editingState[1];

  var statusFormState = useState({ status: '', assignedTo: '', resolutionNotes: '', rejectionReason: '' });
  var statusForm = statusFormState[0];
  var setStatusForm = statusFormState[1];

  var filterState = useState('ALL');
  var filterStatus = filterState[0];
  var setFilterStatus = filterState[1];

  var searchState = useState('');
  var searchText = searchState[0];
  var setSearchText = searchState[1];

  function fetchTickets() {
    setLoading(true);
    fetch(BASE_URL + '/api/tickets')
      .then(function(res) {
        if (!res.ok) throw new Error('Failed to load tickets');
        return res.json();
      })
      .then(function(data) {
        // Sort newest first
        var sorted = data.sort(function(a, b) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setTickets(sorted);
        setLoading(false);
      })
      .catch(function(err) {
        setError(err.message);
        setLoading(false);
      });
  }

  useEffect(function() { fetchTickets(); }, []);

  function openEdit(ticket) {
    setEditingId(ticket.id);
    setStatusForm({
      status: ticket.status,
      assignedTo: ticket.assignedTo || '',
      resolutionNotes: ticket.resolutionNotes || '',
      rejectionReason: ticket.rejectionReason || '',
    });
  }

  function handleStatusUpdate(id) {
    fetch(BASE_URL + '/api/tickets/' + id + '/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(statusForm),
    })
      .then(function(res) {
        if (!res.ok) throw new Error('Update failed');
        setEditingId(null);
        fetchTickets();
      })
      .catch(function(err) {
        alert(err.message);
      });
  }

  function handleDelete(id) {
    if (!window.confirm('Delete this ticket?')) return;
    fetch(BASE_URL + '/api/tickets/' + id, { method: 'DELETE' })
      .then(function() {
        setSelectedTicket(null);
        fetchTickets();
      });
  }

  // Filter + search
  var filtered = tickets.filter(function(t) {
    var matchStatus = filterStatus === 'ALL' || t.status === filterStatus;
    var matchSearch = !searchText ||
      (t.resource && t.resource.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) ||
      (t.userEmail && t.userEmail.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) ||
      (t.category && t.category.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
    return matchStatus && matchSearch;
  });

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading tickets...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <AdminNav />

      <div className="flex flex-1 overflow-hidden">

      {/* LEFT PANEL — ticket list */}
      <div className="w-full max-w-sm border-r border-gray-200 bg-white flex flex-col flex-shrink-0">

        {/* Top bar */}
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-indigo-700 mb-3">All Tickets</h2>

          {/* Search */}
          <input
            placeholder="Search by resource, email..."
            value={searchText}
            onChange={function(e) { setSearchText(e.target.value); }}
            className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 mb-3"
          />

          {/* Filter pills */}
          <div className="flex gap-1.5 flex-wrap">
            {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'].map(function(s) {
              var active = filterStatus === s;
              var cls = active
                ? 'px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-600 text-white'
                : 'px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 hover:bg-gray-200';
              return (
                <button key={s} onClick={function() { setFilterStatus(s); }} className={cls}>
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Ticket rows */}
        <div className="overflow-y-auto flex-1">
          {filtered.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">No tickets found</div>
          )}
          {filtered.map(function(ticket) {
            var isSelected = selectedTicket && selectedTicket.id === ticket.id;
            var statusColor = STATUS_COLORS[ticket.status] || 'bg-gray-100 text-gray-500';

            var dateStr = '';
            if (ticket.createdAt) {
              dateStr = new Date(ticket.createdAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric'
              });
            }

            var rowClass = isSelected
              ? 'px-4 py-3 border-b border-gray-100 cursor-pointer bg-indigo-50 border-l-4 border-l-indigo-500'
              : 'px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 border-l-4 border-l-transparent';

            return (
              <div
                key={ticket.id}
                onClick={function() { setSelectedTicket(ticket); setEditingId(null); }}
                className={rowClass}
              >
                {/* Row: email + date */}
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-semibold text-gray-700 truncate max-w-[160px]">
                    {ticket.userEmail || 'Unknown'}
                  </span>
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{dateStr}</span>
                </div>

                {/* Row: resource name */}
                <p className="text-sm font-medium text-gray-800 truncate">{ticket.resource}</p>

                {/* Row: category + status badge */}
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-400 truncate">{ticket.category}</p>
                  <span className={'text-xs px-2 py-0.5 rounded-full font-medium ml-2 ' + statusColor}>
                    {ticket.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer count */}
        <div className="p-3 border-t border-gray-100 text-xs text-gray-400 text-center">
          {filtered.length} of {tickets.length} tickets
        </div>
      </div>

      {/* RIGHT PANEL — ticket detail */}
      <div className="flex-1 overflow-hidden">
        {selectedTicket ? (
          <TicketDetail
            ticket={selectedTicket}
            adminEmail={adminEmail}
            adminName={adminName}
            editingId={editingId}
            statusForm={statusForm}
            setStatusForm={setStatusForm}
            onEdit={openEdit}
            onDelete={handleDelete}
            onSave={handleStatusUpdate}
            onCancel={function() { setEditingId(null); }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-base font-medium">Select a ticket to view details</p>
            <p className="text-sm mt-1">Click any ticket from the list</p>
          </div>
        )}
      </div>

      </div>

    </div>
  );
}
