// AdminDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNav from '../../components/AdminNav';

export default function AdminDashboard() {
    const navigate = useNavigate();
    
    return (
        <div>
            {/* Added the AdminNav component here */}
            <AdminNav />
            
            <div style={{ padding: '20px' }}>
                <h1>Admin Dashboard</h1>
                <p>Welcome, Admin!</p>
                <button onClick={() => navigate('/users')}>Manage Users</button>
            </div>
        </div>
    );
}