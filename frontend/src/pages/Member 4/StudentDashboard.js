// StudentDashboard.js
import React from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

export default function StudentDashboard() {
    const navigate = useNavigate();
    return (
        <div style={{ padding: '20px' }}>
            <h1>Student Dashboard</h1>
            <p>Welcome, User/Student!</p>

           <button onClick={() => navigate('/my-tickets')}>My Tickets</button>
<button onClick={() => navigate('/ticketForm')}>Create Ticket</button>
        </div>
    );
}