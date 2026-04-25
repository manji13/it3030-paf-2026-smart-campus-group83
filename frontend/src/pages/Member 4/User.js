import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNav from '../../components/AdminNav';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [activeTab, setActiveTab] = useState('users'); // For AdminNav
    const [user, setUser] = useState(null); // For AdminNav user info

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('sch_token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const res = await axios.get('http://localhost:8000/api/v1/auth/users', { headers });
            setUsers(res.data?.data || []);
        } catch (error) {
            console.error("Error fetching users", error);
            showToastMessage('Error fetching users. Make sure you are logged in as Admin.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPageLoaded(true);
        fetchUsers();
        
        // Get current logged-in admin user for nav
        const storedUser = localStorage.getItem('sch_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const showToastMessage = (message, type = 'success') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    const handleRoleChange = async (id, newRole) => {
        try {
            const token = localStorage.getItem('sch_token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            await axios.patch(`http://localhost:8000/api/v1/auth/users/${id}/role`, { role: newRole }, { headers });
            await fetchUsers();
            showToastMessage(`Role changed to ${newRole} successfully!`, 'success');
        } catch (error) {
            console.error("Error updating role", error);
            showToastMessage('Error updating role', 'error');
        }
    };

    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (selectedUser) {
            try {
                const token = localStorage.getItem('sch_token');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                await axios.delete(`http://localhost:8000/api/v1/auth/users/${selectedUser.id}`, { headers });
                await fetchUsers();
                showToastMessage(`User ${selectedUser.name} deleted successfully!`, 'success');
                setShowDeleteModal(false);
                setSelectedUser(null);
            } catch (error) {
                console.error("Error deleting user", error);
                showToastMessage('Error deleting user', 'error');
            }
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setSelectedUser(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('sch_token');
        localStorage.removeItem('sch_user');
        window.location.href = '/login';
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleBadgeColor = (role) => {
        return role === 'ADMIN' 
            ? 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700' 
            : 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Admin Navigation Bar */}
            <AdminNav
                activeTab={activeTab}
                onTabChange={setActiveTab}
                userName={user?.name}
                userEmail={user?.email}
                onLogout={handleLogout}
            />

            {/* Main Content */}
            <div className={`transition-all duration-500 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
                {/* Animated Background Elements (behind content) */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse delay-2000"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                    {/* Header Section */}
                    <div className="mb-8 transform transition-all duration-500 translate-y-0 opacity-100">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                            User Management
                                        </h1>
                                        <p className="text-gray-400 mt-1">Manage system users and their roles</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Stats Cards */}
                            <div className="flex gap-3">
                                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-700">
                                    <p className="text-xs text-gray-400">Total Users</p>
                                    <p className="text-2xl font-bold text-white">{users.length}</p>
                                </div>
                                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-700">
                                    <p className="text-xs text-gray-400">Admins</p>
                                    <p className="text-2xl font-bold text-purple-400">{users.filter(u => u.role === 'ADMIN').length}</p>
                                </div>
                                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-700">
                                    <p className="text-xs text-gray-400">Users</p>
                                    <p className="text-2xl font-bold text-blue-400">{users.filter(u => u.role === 'USER').length}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6 transform transition-all duration-500 delay-100 translate-y-0 opacity-100">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search users by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden transform transition-all duration-500 delay-200 translate-y-0 opacity-100">
                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="relative">
                                    <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                                    <div className="mt-4 text-gray-400">Loading users...</div>
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-900/50 border-b border-gray-700">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Change Role</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {filteredUsers.map((user, index) => (
                                            <tr 
                                                key={user.id} 
                                                className="hover:bg-gray-700/30 transition-colors duration-200 transform animate-fadeInUp"
                                                style={{ animationDelay: `${index * 50}ms` }}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                                                            <span className="text-white font-semibold text-sm">
                                                                {user.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <span className="text-white font-medium">{user.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-300">{user.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(user.role)}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <select
                                                        value={user.role}
                                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                        className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer transition-all duration-200 hover:bg-gray-600"
                                                    >
                                                        <option value="USER">USER</option>
                                                        <option value="ADMIN">ADMIN</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button
                                                        onClick={() => handleDeleteClick(user)}
                                                        className="group relative inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition-all duration-200 transform hover:scale-105 cursor-pointer"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        <span className="text-sm font-medium">Delete</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {filteredUsers.length === 0 && !loading && (
                                    <div className="text-center py-12">
                                        <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-gray-400">No users found</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-4 right-4 z-50 animate-slideInRight">
                    <div className={`rounded-xl shadow-2xl p-4 min-w-[300px] backdrop-blur-md border ${
                        toastType === 'success' 
                            ? 'bg-green-500/10 border-green-500/30' 
                            : 'bg-red-500/10 border-red-500/30'
                    }`}>
                        <div className="flex items-center gap-3">
                            {toastType === 'success' ? (
                                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                            <p className={`text-sm font-medium ${
                                toastType === 'success' ? 'text-green-400' : 'text-red-400'
                            }`}>
                                {toastMessage}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fadeIn">
                    <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm" onClick={cancelDelete}></div>
                    <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 relative z-10 animate-modalPopIn border border-gray-700">
                        <div className="text-center">
                            <div className="mx-auto mb-4 w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Delete User</h3>
                            <p className="text-gray-400 mb-6">
                                Are you sure you want to delete <span className="text-white font-semibold">{selectedUser?.name}</span>? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={cancelDelete}
                                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-all duration-200 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 cursor-pointer"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Keyframes for Animations */}
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    
                    @keyframes modalPopIn {
                        0% {
                            opacity: 0;
                            transform: scale(0.7);
                        }
                        50% {
                            transform: scale(1.05);
                        }
                        100% {
                            opacity: 1;
                            transform: scale(1);
                        }
                    }
                    
                    @keyframes slideInRight {
                        from {
                            opacity: 0;
                            transform: translateX(100px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }
                    
                    .animate-fadeIn {
                        animation: fadeIn 0.3s ease-out;
                    }
                    
                    .animate-fadeInUp {
                        animation: fadeInUp 0.4s ease-out forwards;
                        opacity: 0;
                    }
                    
                    .animate-modalPopIn {
                        animation: modalPopIn 0.3s ease-out;
                    }
                    
                    .animate-slideInRight {
                        animation: slideInRight 0.3s ease-out;
                    }
                `
            }} />
        </div>
    );
}