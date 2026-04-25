import React, { useEffect, useState } from 'react';
import { member4Api } from '../../api/member4Api';
import UsersTable from '../../components/member4/UsersTable';

function UsersManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingUserId, setSavingUserId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await member4Api.getUsers();
      setUsers(response.data.data || []);
    } catch (apiError) {
      setError(apiError?.response?.data?.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const replaceUser = (updatedUser) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  };

  const handleRoleSave = async (userId, role) => {
    setSavingUserId(userId);
    setMessage('');
    setError('');
    try {
      const response = await member4Api.updateUserRole(userId, { role });
      replaceUser(response.data.data);
      setMessage('User role updated successfully.');
    } catch (apiError) {
      setError(apiError?.response?.data?.message || 'Failed to update role.');
    } finally {
      setSavingUserId('');
    }
  };

  const handleStatusToggle = async (userId, active) => {
    setSavingUserId(userId);
    setMessage('');
    setError('');
    try {
      const response = await member4Api.updateUserStatus(userId, { active });
      replaceUser(response.data.data);
      setMessage(`User ${active ? 'activated' : 'deactivated'} successfully.`);
    } catch (apiError) {
      setError(apiError?.response?.data?.message || 'Failed to update status.');
    } finally {
      setSavingUserId('');
    }
  };

  return (
    <section className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ marginTop: 0 }}>User Management</h2>
          <p className="muted" style={{ marginTop: 0 }}>
            Admin-only control panel for managing Smart Campus accounts and roles.
          </p>
        </div>
        <button className="btn secondary" type="button" onClick={loadUsers} disabled={loading}>
          Refresh
        </button>
      </div>

      {message ? <div style={{ color: 'var(--success)', fontWeight: 700, marginBottom: '0.75rem' }}>{message}</div> : null}
      {error ? <div style={{ color: 'var(--danger)', fontWeight: 700, marginBottom: '0.75rem' }}>{error}</div> : null}

      {loading ? (
        <p className="muted">Loading users...</p>
      ) : (
        <UsersTable users={users} savingUserId={savingUserId} onRoleSave={handleRoleSave} onStatusToggle={handleStatusToggle} />
      )}
    </section>
  );
}

export default UsersManagementPage;