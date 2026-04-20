import React, { useEffect, useState } from 'react';
import { member1Api } from '../../api/member1Api';
import SearchFilterBar from '../../components/common/SearchFilterBar';
import ResourceCardMember1 from '../../components/member1/ResourceCardMember1';
import { RESOURCE_STATUS_OPTIONS } from '../../types/statusOptions';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../app/constants';

const initialFilters = {
  type: '',
  minCapacity: '',
  location: '',
  status: ''
};

function ResourceListPage() {
  const { hasAnyRole } = useAuth();
  const [filters, setFilters] = useState(initialFilters);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const canManage = hasAnyRole([ROLES.ADMIN]);

  const loadResources = async (activeFilters = filters) => {
    setLoading(true);
    try {
      const payload = Object.fromEntries(
        Object.entries(activeFilters).filter(([, value]) => value !== '' && value !== null)
      );
      const response = await member1Api.getResources(payload);
      setResources(response.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources(initialFilters);
  }, []);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (resourceId) => {
    if (!window.confirm('Delete this resource?')) return;
    await member1Api.deleteResource(resourceId);
    loadResources();
  };

  return (
    <div className="grid">
      <section>
        <h2 style={{ marginTop: 0 }}>Facilities & Assets Catalogue (member1)</h2>
      </section>

      <SearchFilterBar
        fields={[
          { name: 'type', label: 'Type', placeholder: 'lab, lecture hall...' },
          { name: 'minCapacity', label: 'Min Capacity', type: 'number' },
          { name: 'location', label: 'Location' },
          { name: 'status', label: 'Status', type: 'select', options: RESOURCE_STATUS_OPTIONS }
        ]}
        values={filters}
        onChange={handleFilterChange}
        onSubmit={(event) => {
          event.preventDefault();
          loadResources(filters);
        }}
        onReset={() => {
          setFilters(initialFilters);
          loadResources(initialFilters);
        }}
      />

      {loading ? (
        <div className="panel muted">Loading resources...</div>
      ) : resources.length === 0 ? (
        <div className="panel muted">No resources found for selected filters.</div>
      ) : (
        <div className="grid two">
          {resources.map((resource) => (
            <ResourceCardMember1
              key={resource.id}
              resource={resource}
              canManage={canManage}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ResourceListPage;
