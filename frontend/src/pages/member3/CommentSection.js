import React, { useEffect, useState } from 'react';

var BASE_URL = 'http://localhost:8000';

function formatDate(dateStr) {
  if (!dateStr) return '';
  var d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    + ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function CommentItem(props) {
  var comment = props.comment;
  var currentEmail = props.currentEmail;
  var isAdmin = props.isAdmin;
  var onDelete = props.onDelete;
  var onEdit = props.onEdit;

  var editingState = useState(false);
  var isEditing = editingState[0];
  var setIsEditing = editingState[1];

  var editTextState = useState(comment.text);
  var editText = editTextState[0];
  var setEditText = editTextState[1];

  var isOwner = currentEmail && comment.authorEmail === currentEmail;
  var canEdit = isOwner;
  var canDelete = isOwner || isAdmin;

  var firstLetter = comment.authorName ? comment.authorName[0].toUpperCase() : '?';

  function handleSaveEdit() {
    if (!editText.trim()) return;
    onEdit(comment.id, editText);
    setIsEditing(false);
  }

  return (
    <div className="flex gap-3 py-3 border-b border-gray-50 last:border-0">

      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
        {firstLetter}
      </div>

      <div className="flex-1">
        {/* Author + time */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-gray-700">{comment.authorName}</span>
          {isOwner && (
            <span className="text-xs bg-indigo-50 text-indigo-500 px-1.5 py-0.5 rounded font-medium">You</span>
          )}
          {isAdmin && !isOwner && (
            <span className="text-xs bg-purple-50 text-purple-500 px-1.5 py-0.5 rounded font-medium">Admin</span>
          )}
          <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
          {comment.edited && (
            <span className="text-xs text-gray-400 italic">(edited)</span>
          )}
        </div>

        {/* Comment text or edit box */}
        {isEditing ? (
          <div className="mt-2 flex flex-col gap-2">
            <textarea
              value={editText}
              onChange={function (e) { setEditText(e.target.value); }}
              className="w-full p-2 border border-indigo-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 min-h-[70px]"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-indigo-700"
              >
                Save
              </button>
              <button
                onClick={function () { setIsEditing(false); setEditText(comment.text); }}
                className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">{comment.text}</p>
        )}

        {/* Action buttons */}
        {!isEditing && (
          <div className="flex gap-3 mt-1">
            {canEdit && (
              <button
                onClick={function () { setIsEditing(true); }}
                className="text-xs text-indigo-400 hover:text-indigo-600 transition"
              >
                Edit
              </button>
            )}
            {canDelete && (
              <button
                onClick={function () { onDelete(comment.id); }}
                className="text-xs text-red-400 hover:text-red-600 transition"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CommentSection(props) {
  var ticketId = props.ticketId;
  var currentEmail = props.currentEmail;
  var currentName = props.currentName;
  var isAdmin = props.isAdmin || false;

  var commentsState = useState([]);
  var comments = commentsState[0];
  var setComments = commentsState[1];

  var loadingState = useState(false);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  var newTextState = useState('');
  var newText = newTextState[0];
  var setNewText = newTextState[1];

  var submittingState = useState(false);
  var submitting = submittingState[0];
  var setSubmitting = submittingState[1];

  var openState = useState(false);
  var isOpen = openState[0];
  var setIsOpen = openState[1];

  function fetchComments() {
    setLoading(true);
    fetch(BASE_URL + '/api/tickets/' + ticketId + '/comments')
      .then(function (res) { return res.json(); })
      .then(function (data) { setComments(data); setLoading(false); })
      .catch(function () { setLoading(false); });
  }

  useEffect(function () {
    if (isOpen) fetchComments();
  }, [isOpen, ticketId]);

  function handleAddComment() {
    if (!newText.trim()) return;
    setSubmitting(true);

    fetch(BASE_URL + '/api/tickets/' + ticketId + '/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        authorEmail: currentEmail,
        authorName: currentName,
        text: newText.trim(),
        isAdmin: isAdmin ? 'true' : 'false'
      })
    })
      .then(function (res) { return res.json(); })
      .then(function (newComment) {
        setComments(comments.concat([newComment]));
        setNewText('');
        setSubmitting(false);
      })
      .catch(function () { setSubmitting(false); });
  }

  function handleEdit(commentId, updatedText) {
    fetch(BASE_URL + '/api/comments/' + commentId, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestEmail: currentEmail, text: updatedText })
    })
      .then(function (res) { return res.json(); })
      .then(function (updated) {
        setComments(comments.map(function (c) {
          return c.id === commentId ? updated : c;
        }));
      })
      .catch(function () { alert('Failed to edit comment'); });
  }

  function handleDelete(commentId) {
    if (!window.confirm('Delete this comment?')) return;
    fetch(BASE_URL + '/api/comments/' + commentId + '?requestEmail=' + encodeURIComponent(currentEmail) + '&isAdmin=' + isAdmin, {
      method: 'DELETE'
    })
      .then(function () {
        setComments(comments.filter(function (c) { return c.id !== commentId; }));
      })
      .catch(function () { alert('Failed to delete comment'); });
  }

  return (
    <div className="mt-4 border-t border-gray-100 pt-3">

      {/* Toggle button */}
      <button
        onClick={function () { setIsOpen(!isOpen); }}
        className="flex items-center gap-2 text-xs text-indigo-500 font-medium hover:text-indigo-700 transition"
      >
        <span>{isOpen ? '▲' : '▼'}</span>
        <span>{'💬 Comments (' + comments.length + ')'}</span>
      </button>

      {isOpen && (
        <div className="mt-3">

          {/* Comments list */}
          {loading && (
            <p className="text-xs text-gray-400 py-2">Loading comments...</p>
          )}

          {!loading && comments.length === 0 && (
            <p className="text-xs text-gray-400 py-2 italic">No comments yet. Be the first to comment!</p>
          )}

          {!loading && comments.length > 0 && (
            <div className="mb-3">
              {comments.map(function (comment) {
                return (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    currentEmail={currentEmail}
                    isAdmin={isAdmin}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                );
              })}
            </div>
          )}

          {/* Add comment box */}
          <div className="flex gap-2 mt-2">
            <textarea
              value={newText}
              onChange={function (e) { setNewText(e.target.value); }}
              placeholder="Write a comment..."
              className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 min-h-[60px] resize-none"
            />
            <button
              onClick={handleAddComment}
              disabled={submitting || !newText.trim()}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed self-end"
            >
              {submitting ? '...' : 'Send'}
            </button>
          </div>

        </div>
      )}
    </div>
  );
}