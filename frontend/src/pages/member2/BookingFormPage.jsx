import React, { useEffect, useState } from 'react';
import { member1Api } from '../../api/member1Api';
import { member2Api } from '../../api/member2Api';

const initialForm = {
  resourceId: '',
  date: '',
  startTime: '',
  endTime: '',
  purpose: '',
  expectedAttendees: 1
};

function BookingFormPage() {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    member1Api.getResources({ status: 'ACTIVE' }).then((response) => {
      setResources(response.data.data || []);
    });
  }, []);

  const updateField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback('');
    setError('');
    if (!form.resourceId || !form.date || !form.startTime || !form.endTime || !form.purpose) {
      setError('Please complete all required booking fields.');
      return;
    }

    try {
      await member2Api.createBooking({
        ...form,
        expectedAttendees: Number(form.expectedAttendees)
      });
      setFeedback('Booking request submitted successfully.');
      setForm(initialForm);
    } catch (apiError) {
      setError(apiError?.response?.data?.message || 'Booking request failed.');
    }
  };

  return (
    <section className="panel">
      <h2 style={{ marginTop: 0 }}>Booking Request Form (member2)</h2>

      <form className="grid two" onSubmit={handleSubmit}>
        <div>
          <label className="label">Resource</label>
          <select className="select" value={form.resourceId} onChange={(e) => updateField('resourceId', e.target.value)}>
            <option value="">Select Resource</option>
            {resources.map((resource) => (
              <option key={resource.id} value={resource.id}>
                {resource.name} ({resource.location})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Date</label>
          <input className="input" type="date" value={form.date} onChange={(e) => updateField('date', e.target.value)} />
        </div>

        <div>
          <label className="label">Start Time</label>
          <input
            className="input"
            type="time"
            value={form.startTime}
            onChange={(e) => updateField('startTime', e.target.value)}
          />
        </div>

        <div>
          <label className="label">End Time</label>
          <input className="input" type="time" value={form.endTime} onChange={(e) => updateField('endTime', e.target.value)} />
        </div>

        <div>
          <label className="label">Expected Attendees</label>
          <input
            className="input"
            type="number"
            min="1"
            value={form.expectedAttendees}
            onChange={(e) => updateField('expectedAttendees', e.target.value)}
          />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label className="label">Purpose</label>
          <textarea className="textarea" rows={3} value={form.purpose} onChange={(e) => updateField('purpose', e.target.value)} />
        </div>

        {feedback && <div style={{ gridColumn: '1 / -1', color: '#2d8a55', fontWeight: 700 }}>{feedback}</div>}
        {error && <div style={{ gridColumn: '1 / -1', color: '#c44536', fontWeight: 700 }}>{error}</div>}

        <div style={{ gridColumn: '1 / -1' }}>
          <button className="btn primary">Submit Booking Request</button>
        </div>
      </form>
    </section>
  );
}

export default BookingFormPage;
