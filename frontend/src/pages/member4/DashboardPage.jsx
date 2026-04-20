import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import RoleBadgeMember4 from '../../components/member4/RoleBadgeMember4';

function DashboardPage() {
  const { user } = useAuth();

  const quickLinks = [
    { to: '/resources', label: 'Resource Catalogue', owner: 'member1' },
    { to: '/bookings/new', label: 'New Booking', owner: 'member2' },
    { to: '/tickets/new', label: 'Raise Incident Ticket', owner: 'member3' },
    { to: '/notifications', label: 'Notifications', owner: 'member4' }
  ];

  return (
    <div className="grid">
      <section className="panel">
        <h2 style={{ marginTop: 0 }}>Welcome, {user?.name || 'Campus User'}</h2>
        <p className="muted">Role-based operations dashboard for Smart Campus management.</p>
        <div>
          {(user?.roles || []).map((role) => (
            <RoleBadgeMember4 key={role} role={role} />
          ))}
        </div>
      </section>

      <section className="grid two">
        {quickLinks.map((item) => (
          <Link key={item.to} to={item.to} className="panel">
            <div style={{ fontWeight: 700 }}>{item.label}</div>
            <div className="muted" style={{ fontSize: '0.88rem' }}>
              Owned by {item.owner}
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}

export default DashboardPage;
