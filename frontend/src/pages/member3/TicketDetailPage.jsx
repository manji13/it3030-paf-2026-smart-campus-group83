import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { member3Api } from '../../api/member3Api';
import StatusBadge from '../../components/common/StatusBadge';
import TicketCommentListMember3 from '../../components/member3/TicketCommentListMember3';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../app/constants';

function TicketDetailPage() {
  const { ticketId } = useParams();
  const { user, hasAnyRole } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [commentMessage, setCommentMessage] = useState('');
  const [technicianId, setTechnicianId] = useState('');
  const [newStatus, setNewStatus] = useState('IN_PROGRESS');
  const [resolutionNotes, setResolutionNotes] = useState('');

  const isAdmin = hasAnyRole([ROLES.ADMIN]);
  const canOperateTicket = hasAnyRole([ROLES.ADMIN, ROLES.TECHNICIAN]);

  const loadTicket = async () => {
    const response = await member3Api.getTicketById(ticketId);
    setTicket(response.data.data);
  };

  useEffect(() => {
    loadTicket();
  }, [ticketId]);

  if (!ticket) {
    return <section className="panel muted">Loading ticket details...</section>;
  }

  const addComment = async () => {
    if (!commentMessage.trim()) return;
    await member3Api.addComment(ticketId, { message: commentMessage });
    setCommentMessage('');
    loadTicket();
  };

  const updateComment = async (commentId, message) => {
    await member3Api.updateComment(ticketId, commentId, { message });
    loadTicket();
  };

  const deleteComment = async (commentId) => {
    await member3Api.deleteComment(ticketId, commentId);
    loadTicket();
  };

  const assignTechnician = async () => {
    if (!technicianId.trim()) return;
    await member3Api.assignTechnician(ticketId, { assignedTechnicianId: technicianId });
    setTechnicianId('');
    loadTicket();
  };

  const updateStatus = async () => {
    await member3Api.updateStatus(ticketId, { status: newStatus });
    loadTicket();
  };

  const addResolution = async () => {
    if (!resolutionNotes.trim()) return;
    await member3Api.addResolution(ticketId, { resolutionNotes });
    setResolutionNotes('');
    loadTicket();
  };

  return (
    <div className="grid">
      <section className="panel">
        <h2 style={{ marginTop: 0 }}>Ticket Detail (member3)</h2>
        <div className="grid two">
          <div>
            <strong>ID:</strong> {ticket.id}
          </div>
          <div>
            <strong>Status:</strong> <StatusBadge status={ticket.status} />
          </div>
          <div>
            <strong>Category:</strong> {ticket.category}
          </div>
          <div>
            <strong>Priority:</strong> {ticket.priority}
          </div>
          <div>
            <strong>Assigned Technician:</strong> {ticket.assignedTechnicianId || '-'}
          </div>
          <div>
            <strong>Owner:</strong> {ticket.createdBy}
          </div>
        </div>
        <p className="muted">{ticket.description}</p>
      </section>

      {canOperateTicket && (
        <section className="panel grid two">
          {isAdmin && (
            <div>
              <label className="label">Assign Technician</label>
              <input
                className="input"
                value={technicianId}
                onChange={(e) => setTechnicianId(e.target.value)}
                placeholder="Technician user ID"
              />
              <button className="btn secondary" style={{ marginTop: '0.5rem' }} onClick={assignTechnician}>
                Assign
              </button>
            </div>
          )}

          <div>
            <label className="label">Update Status</label>
            <select className="select" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="CLOSED">CLOSED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
            <button className="btn secondary" style={{ marginTop: '0.5rem' }} onClick={updateStatus}>
              Save Status
            </button>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label className="label">Resolution Notes</label>
            <textarea
              className="textarea"
              rows={3}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
            />
            <button className="btn secondary" style={{ marginTop: '0.5rem' }} onClick={addResolution}>
              Add Resolution Notes
            </button>
          </div>
        </section>
      )}

      <section className="panel">
        <h3 style={{ marginTop: 0 }}>Comments</h3>

        <div style={{ marginBottom: '0.8rem' }}>
          <textarea
            className="textarea"
            rows={3}
            value={commentMessage}
            placeholder="Add a comment"
            onChange={(e) => setCommentMessage(e.target.value)}
          />
          <button className="btn primary" style={{ marginTop: '0.5rem' }} onClick={addComment}>
            Post Comment
          </button>
        </div>

        <TicketCommentListMember3
          comments={ticket.comments || []}
          currentUserId={user?.id}
          isAdmin={isAdmin}
          onUpdateComment={updateComment}
          onDeleteComment={deleteComment}
        />
      </section>
    </div>
  );
}

export default TicketDetailPage;