import React from 'react';

function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="panel" style={{ maxWidth: 360, margin: '2rem auto', textAlign: 'center' }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>⏳</div>
      <div className="muted">{label}</div>
    </div>
  );
}

export default LoadingSpinner;
