import React from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';

function NotificationBell() {
  const { unreadCount } = useNotifications();

  return (
    <Link to="/notifications" style={{ position: 'relative', display: 'inline-flex' }}>
      <span style={{ fontSize: '1.2rem' }}>🔔</span>
      {unreadCount > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-10px',
            background: '#c44536',
            color: '#fff',
            borderRadius: '999px',
            fontSize: '0.7rem',
            minWidth: '18px',
            textAlign: 'center',
            padding: '1px 5px'
          }}
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  );
}

export default NotificationBell;
