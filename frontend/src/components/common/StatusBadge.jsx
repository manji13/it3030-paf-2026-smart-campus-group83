import React from 'react';

const statusColors = {
  ACTIVE: '#2d8a55',
  OUT_OF_SERVICE: '#c44536',
  PENDING: '#ee9b00',
  APPROVED: '#2d8a55',
  REJECTED: '#c44536',
  CANCELLED: '#506682',
  OPEN: '#005f73',
  IN_PROGRESS: '#0a84ff',
  RESOLVED: '#2d8a55',
  CLOSED: '#506682'
};

function StatusBadge({ status }) {
  const color = statusColors[status] || '#506682';
  return (
    <span
      style={{
        background: `${color}20`,
        color,
        border: `1px solid ${color}55`,
        borderRadius: '999px',
        padding: '0.2rem 0.6rem',
        fontSize: '0.78rem',
        fontWeight: 700
      }}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
