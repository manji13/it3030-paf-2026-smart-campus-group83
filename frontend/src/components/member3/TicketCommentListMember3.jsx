import React, { useState } from 'react';
import { formatDateTime } from '../../utils/date';

function TicketCommentListMember3({ comments = [], currentUserId, isAdmin, onUpdateComment, onDeleteComment }) {
  const [editingId, setEditingId] = useState('');
  const [draftMessage, setDraftMessage] = useState('');

  if (!comments.length) {
    return <p className="muted">No comments yet.</p>;
  }

  return (
    <div className="grid">
      {comments.map((comment) => {
        const canModify = isAdmin || comment.authorUserId === currentUserId;
        const isEditing = editingId === comment.id;

        return (
          <article key={comment.id} className="panel" style={{ background: '#fdfefe' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
              <strong>{comment.authorDisplayName || comment.authorUserId}</strong>
              <span className="muted" style={{ fontSize: '0.84rem' }}>
                {formatDateTime(comment.updatedAt || comment.createdAt)}
              </span>
            </div>

            {isEditing ? (
              <div style={{ marginTop: '0.6rem' }}>
                <textarea
                  className="textarea"
                  rows={3}
                  value={draftMessage}
                  onChange={(event) => setDraftMessage(event.target.value)}
                />
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button
                    className="btn primary"
                    onClick={() => {
                      onUpdateComment(comment.id, draftMessage);
                      setEditingId('');
                    }}
                  >
                    Save
                  </button>
                  <button className="btn secondary" onClick={() => setEditingId('')}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p style={{ marginBottom: 0 }}>{comment.message}</p>
            )}

            {!isEditing && canModify && (
              <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn secondary"
                  onClick={() => {
                    setEditingId(comment.id);
                    setDraftMessage(comment.message);
                  }}
                >
                  Edit
                </button>
                <button className="btn danger" onClick={() => onDeleteComment(comment.id)}>
                  Delete
                </button>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

export default TicketCommentListMember3;
