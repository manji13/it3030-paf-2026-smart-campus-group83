import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/users/login', credentials);
            const user = response.data;
            
            // Save user to local storage for session management
            localStorage.setItem('user', JSON.stringify(user));

            // Navigate based on Role
            if (user.role === 'ADMIN') {
                navigate('/admin-page');
            } else {
                navigate('/student-page');
            }

        } catch (error) {
            alert("Invalid Credentials");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" onChange={e => setCredentials({...credentials, email: e.target.value})} required /><br/><br/>
                <input type="password" placeholder="Password" onChange={e => setCredentials({...credentials, password: e.target.value})} required /><br/><br/>
                <button type="submit">Login</button>
            </form>
            <br />
            <button onClick={() => navigate('/register')}>Go to Register</button>
        </div>
    );
}