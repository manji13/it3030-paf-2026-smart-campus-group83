import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { member1Api } from '../../api/member1Api';
import StatusBadge from '../../components/common/StatusBadge';

function ResourceDetailsPage() {
  const { resourceId } = useParams();
  const [resource, setResource] = useState(null);

  useEffect(() => {
    member1Api.getResourceById(resourceId).then((response) => {
      setResource(response.data.data);
    });
  }, [resourceId]);

  if (!resource) {
    return <section className="panel muted">Loading resource details...</section>;
  }

  return (
    <section className="panel">
      <h2 style={{ marginTop: 0 }}>{resource.name}</h2>
      <div style={{ marginBottom: '0.8rem' }}>
        <StatusBadge status={resource.status} />
      </div>
      <div className="grid two">
        <div>
          <strong>Type:</strong> {resource.type}
        </div>
        <div>
          <strong>Capacity:</strong> {resource.capacity}
        </div>
        <div>
          <strong>Location:</strong> {resource.location}
        </div>
        <div>
          <strong>Availability:</strong> {(resource.availabilityWindows || []).join(', ')}
        </div>
      </div>
      <p className="muted">{resource.description || 'No description provided.'}</p>
      <Link className="btn secondary" to="/resources">
        Back to List
      </Link>
    </section>
  );
}

export default ResourceDetailsPage;