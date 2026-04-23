import React, { useEffect, useState } from 'react';
import CommentSection from './CommentSection';

const STATUS_COLORS = {
  OPEN: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
  RESOLVED: 'bg-green-100 text-green-700',
  CLOSED: 'bg-gray-200 text-gray-600',
  REJECTED: 'bg-red-100 text-red-600',
};

const PRIORITY_COLORS = {
  HIGH: 'text-red-600 font-bold',
  MEDIUM: 'text-yellow-600 font-semibold',
  LOW: 'text-green-600',
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

function TicketCard(props) {
  var ticket = props.ticket;
  var userEmail = props.userEmail;
  var userName = props.userName;

  var statusColor = STATUS_COLORS[ticket.status] || 'bg-gray-100 text-gray-500';
  var priorityColor = PRIORITY_COLORS[ticket.priority] || 'text-gray-600';

  var dateStr = '';
  if (ticket.createdAt) {
    dateStr = new Date(ticket.createdAt).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">

      {/* Top Row */}
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <h3 className="font-semibold text-gray-800 text-base">{ticket.resource}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{ticket.category} · {ticket.location}</p>
        </div>
        <span className={'text-xs px-3 py-1 rounded-full font-semibold ' + statusColor}>
          {ticket.status}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mt-3 leading-relaxed">{ticket.description}</p>

      {/* Meta */}
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
        <span>Priority: <span className={priorityColor}>{ticket.priority}</span></span>
        <span>{ticket.contactDetails}</span>
        {ticket.assignedTo && (
          <span>
            Assigned to: <span className="font-medium text-gray-700">{ticket.assignedTo}</span>
          </span>
        )}
        {dateStr !== '' && (
          <span>{dateStr}</span>
        )}
      </div>

      {/* Resolution Notes */}
      {ticket.resolutionNotes && (
        <div className="mt-3 bg-green-50 border border-green-100 rounded-xl p-3 text-xs text-green-700">
          <span className="font-semibold">Resolution: </span>
          {ticket.resolutionNotes}
        </div>
      )}

      {/* Rejection Reason */}
      {ticket.rejectionReason && (
        <div className="mt-3 bg-red-50 border border-red-100 rounded-xl p-3 text-xs text-red-600">
          <span className="font-semibold">Rejection Reason: </span>
          {ticket.rejectionReason}
        </div>
      )}

      {/* Images */}
      {ticket.imageUrls && ticket.imageUrls.length > 0 && (
        <div className="mt-4">
          <p className="text-xs text-gray-400 mb-2 font-medium">Attachments:</p>
          <div className="flex gap-2 flex-wrap">
            {ticket.imageUrls.map(function(url, i) {
              return <ImageCard key={i} url={url} />;
            })}
          </div>
        </div>
      )}

      {/* Comment Section */}
      <CommentSection
        ticketId={ticket.id}
        currentEmail={userEmail}
        currentName={userName}
        isAdmin={false}
      />

    </div>
  );
}

export default function MyTickets() {
  var stored = localStorage.getItem('user') || '{}';
  var user = JSON.parse(stored);
  var userEmail = user.email || '';
  var userName = user.name || user.email || 'User';

  var ticketsState = useState([]);
  var tickets = ticketsState[0];
  var setTickets = ticketsState[1];

  var loadingState = useState(true);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  var errorState = useState('');
  var error = errorState[0];
  var setError = errorState[1];

  useEffect(function() {
    if (!userEmail) {
      setError('You are not logged in.');
      setLoading(false);
      return;
    }

    fetch(BASE_URL + '/api/tickets/my?email=' + encodeURIComponent(userEmail))
      .then(function(res) {
        if (!res.ok) throw new Error('Failed to fetch tickets');
        return res.json();
      })
      .then(function(data) {
        setTickets(data);
        setLoading(false);
      })
      .catch(function(err) {
        setError(err.message);
        setLoading(false);
      });
  }, [userEmail]);

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-400">Loading your tickets...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 text-red-500 font-medium">{error}</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-8 px-4">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-indigo-700">My Tickets</h2>
        <p className="text-sm text-gray-400 mt-1">
          Logged in as: <span className="font-medium text-gray-600">{userEmail}</span>
          {' · '}
          <span className="font-medium text-indigo-500">{tickets.length} ticket(s)</span>
        </p>
      </div>

      {/* Empty State */}
      {tickets.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <p className="text-5xl mb-4">🎫</p>
          <p className="text-lg font-semibold text-gray-600">No tickets yet</p>
          <p className="text-sm text-gray-400 mt-1">Submit a ticket and it will appear here.</p>
        </div>
      )}

      {/* Ticket Cards */}
      {tickets.length > 0 && (
        <div className="flex flex-col gap-5">
          {tickets.map(function(ticket) {
            return (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                userEmail={userEmail}
                userName={userName}
              />
            );
          })}
        </div>
      )}

    </div>
  );
}