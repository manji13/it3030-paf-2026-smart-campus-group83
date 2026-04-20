import React from 'react';
import { Outlet } from 'react-router-dom';

function AdminLayout() {
  return (
    <section className="panel">
      <h2 style={{ marginTop: 0 }}>Admin Workspace</h2>
      <Outlet />
    </section>
  );
}

export default AdminLayout;
