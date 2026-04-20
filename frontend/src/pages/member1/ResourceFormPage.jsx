import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { member1Api } from '../../api/member1Api';

const initialForm = {
  name: '',
  type: '',
  capacity: 1,
  location: '',
  availabilityWindows: '08:00-12:00,13:00-17:00',
  status: 'ACTIVE',
  description: ''
};

function ResourceFormPage({ mode }) {
  const navigate = useNavigate();
  const { resourceId } = useParams();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (mode !== 'edit' || !resourceId) return;
    member1Api.getResourceById(resourceId).then((response) => {
      const item = response.data.data;
      setForm({
        name: item.name,
        type: item.type,
        capacity: item.capacity,
        location: item.location,
        availabilityWindows: (item.availabilityWindows || []).join(','),
        status: item.status,
        description: item.description || ''
      });
    });
  }, [mode, resourceId]);

  const updateField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!form.name || !form.type || !form.location) {
      setError('Please fill all required fields.');
      return;
    }

    const payload = {
      ...form,
      capacity: Number(form.capacity),
      availabilityWindows: form.availabilityWindows
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean)
    };

    try {
      setSubmitting(true);
      if (mode === 'edit') {
        await member1Api.updateResource(resourceId, payload);
      } else {
        await member1Api.createResource(payload);
      }
      navigate('/resources');
    } catch (apiError) {
      setError(apiError?.response?.data?.message || 'Unable to save resource.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="panel">
      <h2 style={{ marginTop: 0 }}>
        {mode === 'edit' ? 'Edit Resource' : 'Create Resource'} (member1)
      </h2>

      <form className="grid two" onSubmit={handleSubmit}>
        <div>
          <label className="label">Name</label>
          <input className="input" value={form.name} onChange={(e) => updateField('name', e.target.value)} />
        </div>

        <div>
          <label className="label">Type</label>
          <input className="input" value={form.type} onChange={(e) => updateField('type', e.target.value)} />
        </div>

        <div>
          <label className="label">Capacity</label>
          <input
            className="input"
            type="number"
            min="1"
            value={form.capacity}
            onChange={(e) => updateField('capacity', e.target.value)}
          />
        </div>

        <div>
          <label className="label">Location</label>
          <input className="input" value={form.location} onChange={(e) => updateField('location', e.target.value)} />
        </div>

        <div>
          <label className="label">Status</label>
          <select className="select" value={form.status} onChange={(e) => updateField('status', e.target.value)}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
          </select>
        </div>

        <div>
          <label className="label">Availability Windows (comma-separated)</label>
          <input
            className="input"
            value={form.availabilityWindows}
            onChange={(e) => updateField('availabilityWindows', e.target.value)}
          />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label className="label">Description</label>
          <textarea
            className="textarea"
            rows={4}
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
          />
        </div>

        {error && (
          <div style={{ gridColumn: '1 / -1', color: '#c44536', fontWeight: 600 }}>
            {error}
          </div>
        )}

        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.5rem' }}>
          <button className="btn primary" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Resource'}
          </button>
          <button className="btn secondary" type="button" onClick={() => navigate('/resources')}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}

export default ResourceFormPage;
