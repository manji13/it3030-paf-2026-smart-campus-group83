import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserManagement() {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        const res = await axios.get('http://localhost:8000/api/users');
        setUsers(res.data);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (id, newRole) => {
        try {
            await axios.put(`http://localhost:8000/api/users/${id}/role`, { role: newRole });
            fetchUsers(); // Refresh the list
        } catch (error) {
            console.error("Error updating role");
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axios.delete(`http://localhost:8000/api/users/${id}`);
                fetchUsers(); // Refresh the list
            } catch (error) {
                console.error("Error deleting user");
            }
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>User Management</h2>
            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Action (Change Role)</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <select 
                                    value={user.role} 
                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                >
                                    <option value="USER">USER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </td>
                            <td>
                                <button onClick={() => handleDelete(user.id)} style={{ color: 'red' }}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}