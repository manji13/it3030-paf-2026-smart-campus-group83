import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';

function ResourceCardMember1({ resource, canManage, onDelete }) {
  return (
    <article className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.8rem' }}>
        <div>
          <h3 style={{ marginTop: 0, marginBottom: '0.35rem' }}>{resource.name}</h3>
          <div className="muted" style={{ fontSize: '0.9rem' }}>
            {resource.type} | Capacity: {resource.capacity} | {resource.location}
          </div>
        </div>
        <StatusBadge status={resource.status} />
      </div>

      <p className="muted" style={{ marginBottom: '0.8rem' }}>
        {resource.description || 'No description provided.'}
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <Link className="btn secondary" to={`/resources/${resource.id}`}>
          View
        </Link>
        {canManage && (
          <>
            <Link className="btn secondary" to={`/resources/${resource.id}/edit`}>
              Edit
            </Link>
            <button className="btn danger" onClick={() => onDelete(resource.id)}>
              Delete
            </button>
          </>
        )}
      </div>
    </article>
  );
}

export default ResourceCardMember1;
