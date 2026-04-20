import React from 'react';
import { Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <div className="auth-card">
      <Outlet />
    </div>
  );
}

export default AuthLayout;
