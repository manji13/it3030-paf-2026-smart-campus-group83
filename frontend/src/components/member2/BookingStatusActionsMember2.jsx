import React, { useState } from 'react';

function BookingStatusActionsMember2({ booking, onDecision }) {
  const [reason, setReason] = useState('');

  if (booking.status !== 'PENDING') {
    return null;
  }

  return (
    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
      <button className="btn primary" onClick={() => onDecision(booking.id, { status: 'APPROVED' })}>
        Approve
      </button>
      <input
        className="input"
        style={{ maxWidth: 220 }}
        value={reason}
        placeholder="Rejection reason"
        onChange={(event) => setReason(event.target.value)}
      />
      <button
        className="btn danger"
        onClick={() => onDecision(booking.id, { status: 'REJECTED', rejectionReason: reason })}
      >
        Reject
      </button>
    </div>
  );
}

export default BookingStatusActionsMember2;
