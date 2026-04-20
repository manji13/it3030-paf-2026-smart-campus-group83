import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROLES } from '../../app/constants';
import { useAuth } from '../../hooks/useAuth';

function Sidebar() {
  const { user, hasAnyRole } = useAuth();
  const navItems = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/resources', label: 'Resources (M1)' },
    { to: '/bookings/new', label: 'Create Booking (M2)' },
    { to: '/bookings/me', label: 'My Bookings (M2)' },
    { to: '/tickets/new', label: 'Create Ticket (M3)' },
    { to: '/tickets', label: 'Ticket List (M3)' },
    { to: '/notifications', label: 'Notifications (M4)' }
  ];

  if (hasAnyRole([ROLES.ADMIN])) {
    navItems.push({ to: '/resources/new', label: 'Resource Admin (M1)' });
    navItems.push({ to: '/admin/bookings', label: 'Booking Admin (M2)' });
  }

  return (
    <aside
      style={{
        borderRight: '1px solid var(--border)',
        background: 'linear-gradient(180deg, #043f4d 0%, #005f73 45%, #0a6f84 100%)',
        color: '#ecfeff',
        padding: '1rem'
      }}
    >
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontWeight: 800, letterSpacing: '0.03em' }}>SCH Hub</div>
        <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>{user?.email}</div>
      </div>

      <nav style={{ display: 'grid', gap: '0.5rem' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              padding: '0.55rem 0.7rem',
              borderRadius: '8px',
              background: isActive ? '#fef3c7' : 'transparent',
              color: isActive ? '#10223a' : '#ecfeff',
              fontWeight: isActive ? 700 : 500
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
