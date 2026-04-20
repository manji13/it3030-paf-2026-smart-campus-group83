import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/users/register', formData);
            alert("Registration Successful!");
            navigate('/login');
        } catch (error) {
            alert("Error registering user");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Name" onChange={e => setFormData({...formData, name: e.target.value})} required /><br/><br/>
                <input type="email" placeholder="Email" onChange={e => setFormData({...formData, email: e.target.value})} required /><br/><br/>
                <input type="password" placeholder="Password" onChange={e => setFormData({...formData, password: e.target.value})} required /><br/><br/>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}