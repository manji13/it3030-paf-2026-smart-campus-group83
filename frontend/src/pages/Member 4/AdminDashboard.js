// AdminDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const navigate = useNavigate();
    return (
        <div style={{ padding: '20px' }}>
            <h1>Admin Dashboard</h1>
            <p>Welcome, Admin!</p>
            <button onClick={() => navigate('/users')}>Manage Users</button>
        </div>
    );
}