import React from 'react';
import NotificationBell from './NotificationBell';
import { useAuth } from '../../hooks/useAuth';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header
      className="panel"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}
    >
      <div>
        <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Smart Campus Operations Hub</div>
        <div className="muted" style={{ fontSize: '0.86rem' }}>
          SLIIT IT3030 PAF 2026 - Production-inspired demo
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <NotificationBell />
        {user?.profileImageUrl || user?.pictureUrl ? (
          <img
            src={user.profileImageUrl || user.pictureUrl}
            alt={user.fullName || user.name || 'User'}
            style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '2px solid #d9e3ee' }}
          />
        ) : null}
        <div className="muted" style={{ fontSize: '0.9rem' }}>
          {user?.fullName || user?.name || 'Unknown User'}
        </div>
        <button className="btn secondary" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
