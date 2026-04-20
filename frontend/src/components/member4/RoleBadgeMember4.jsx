import React from 'react';

const roleColors = {
  USER: '#0a84ff',
  ADMIN: '#c44536',
  TECHNICIAN: '#2d8a55'
};

function RoleBadgeMember4({ role }) {
  const color = roleColors[role] || '#506682';
  return (
    <span
      style={{
        borderRadius: '999px',
        border: `1px solid ${color}55`,
        background: `${color}22`,
        color,
        padding: '0.18rem 0.6rem',
        fontSize: '0.78rem',
        fontWeight: 700,
        marginRight: '0.35rem'
      }}
    >
      {role}
    </span>
  );
}

export default RoleBadgeMember4;
