import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';

function MainLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <Navbar />
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
