import React, { useEffect, useState } from 'react';

function RoleChangeAction({ currentRole, onSave, disabled }) {
  const [selectedRole, setSelectedRole] = useState(currentRole);

  useEffect(() => {
    setSelectedRole(currentRole);
  }, [currentRole]);

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <select
        className="select"
        value={selectedRole}
        onChange={(event) => setSelectedRole(event.target.value)}
        style={{ minWidth: 130 }}
        disabled={disabled}
      >
        <option value="USER">USER</option>
        <option value="ADMIN">ADMIN</option>
        <option value="TECHNICIAN">TECHNICIAN</option>
      </select>
      <button className="btn secondary" type="button" onClick={() => onSave(selectedRole)} disabled={disabled}>
        {disabled ? 'Saving...' : 'Update'}
      </button>
    </div>
  );
}

export default RoleChangeAction;