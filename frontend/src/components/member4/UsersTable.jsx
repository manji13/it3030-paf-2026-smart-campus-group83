import React from 'react';
import RoleBadgeMember4 from './RoleBadgeMember4';
import RoleChangeAction from './RoleChangeAction';
import StatusBadge from '../common/StatusBadge';
import { formatDateTime } from '../../utils/date';

function UsersTable({ users = [], savingUserId, onRoleSave, onStatusToggle }) {
  if (!users.length) {
    return <p className="muted">No users found.</p>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                  {user.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt={user.fullName}
                      style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: 'var(--surface-alt)',
                        display: 'grid',
                        placeItems: 'center',
                        fontWeight: 800,
                        color: 'var(--muted)'
                      }}
                    >
                      {user.fullName?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                  )}
                  <div>
                    <div style={{ fontWeight: 700 }}>{user.fullName}</div>
                    <div className="muted" style={{ fontSize: '0.82rem' }}>
                      ID: {user.id}
                    </div>
                  </div>
                </div>
              </td>
              <td>{user.email}</td>
              <td>
                <RoleBadgeMember4 role={user.role} />
              </td>
              <td>
                <StatusBadge status={user.active ? 'ACTIVE' : 'OUT_OF_SERVICE'} />
              </td>
              <td>{formatDateTime(user.createdAt)}</td>
              <td>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  <RoleChangeAction
                    currentRole={user.role}
                    disabled={savingUserId === user.id}
                    onSave={(nextRole) => onRoleSave(user.id, nextRole)}
                  />
                  <button className="btn secondary" type="button" onClick={() => onStatusToggle(user.id, !user.active)}>
                    {user.active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersTable;