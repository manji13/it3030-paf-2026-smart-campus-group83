import React, { useState } from 'react';
import { member3Api } from '../../api/member3Api';

const initialForm = {
  resourceId: '',
  location: '',
  category: 'MAINTENANCE',
  description: '',
  priority: 'MEDIUM',
  preferredContact: '',
  attachmentsInput: ''
};

function TicketCreatePage() {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const updateField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!form.category || !form.description || !form.priority || !form.preferredContact) {
      setError('Please complete all required fields.');
      return;
    }

    const urls = form.attachmentsInput
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 3);

    const payload = {
      resourceId: form.resourceId || null,
      location: form.location || null,
      category: form.category,
      description: form.description,
      priority: form.priority,
      preferredContact: form.preferredContact,
      attachments: urls.map((url, index) => ({
        fileName: `attachment-${index + 1}`,
        fileUrl: url,
        contentType: 'image/jpeg'
      }))
    };

    try {
      await member3Api.createTicket(payload);
      setMessage('Ticket created successfully.');
      setForm(initialForm);
    } catch (apiError) {
      setError(apiError?.response?.data?.message || 'Failed to create ticket.');
    }
  };

  return (
    <section className="panel">
      <h2 style={{ marginTop: 0 }}>Create Incident Ticket (member3)</h2>

      <form className="grid two" onSubmit={handleSubmit}>
        <div>
          <label className="label">Resource ID (optional)</label>
          <input className="input" value={form.resourceId} onChange={(e) => updateField('resourceId', e.target.value)} />
        </div>

        <div>
          <label className="label">Location (optional)</label>
          <input className="input" value={form.location} onChange={(e) => updateField('location', e.target.value)} />
        </div>

        <div>
          <label className="label">Category</label>
          <input className="input" value={form.category} onChange={(e) => updateField('category', e.target.value)} />
        </div>

        <div>
          <label className="label">Priority</label>
          <select className="select" value={form.priority} onChange={(e) => updateField('priority', e.target.value)}>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>
        </div>

        <div>
          <label className="label">Preferred Contact</label>
          <input
            className="input"
            value={form.preferredContact}
            onChange={(e) => updateField('preferredContact', e.target.value)}
          />
        </div>

        <div>
          <label className="label">Attachment URLs (max 3, comma-separated)</label>
          <input
            className="input"
            value={form.attachmentsInput}
            onChange={(e) => updateField('attachmentsInput', e.target.value)}
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

        {message && <div style={{ gridColumn: '1 / -1', color: '#2d8a55' }}>{message}</div>}
        {error && <div style={{ gridColumn: '1 / -1', color: '#c44536' }}>{error}</div>}

        <div style={{ gridColumn: '1 / -1' }}>
          <button className="btn primary">Submit Ticket</button>
        </div>
      </form>
    </section>
  );
}

export default TicketCreatePage;
