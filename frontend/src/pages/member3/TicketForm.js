import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const API_BASE_URL = 'http://localhost:8000/api/tickets';

const TicketForm = ({ onTicketCreated }) => {
  // Read logged-in user from localStorage (set by Login.jsx)
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userEmail = user.email || '';

  const [formData, setFormData] = useState({
    resource: '',
    location: '',
    category: '',
    description: '',
    priority: 'MEDIUM',
    contactDetails: userEmail, // pre-fill with user's email
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    const newImages = [...images, ...acceptedFiles].slice(0, 3);
    setImages(newImages);
    setPreviews(newImages.map(file => URL.createObjectURL(file)));
  }, [images]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 3,
  });

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviews(newImages.map(file => URL.createObjectURL(file)));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Include userEmail in the ticket payload
    const ticketPayload = { ...formData, userEmail };

    const formDataToSend = new FormData();
    formDataToSend.append('ticket', new Blob([JSON.stringify(ticketPayload)], { type: 'application/json' }));
    images.forEach(image => formDataToSend.append('images', image));

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        body: formDataToSend,
      });
      if (!response.ok) throw new Error('Failed to create ticket');
      const newTicket = await response.json();

      setFormData({
        resource: '', location: '', category: '',
        description: '', priority: 'MEDIUM', contactDetails: userEmail,
      });
      setImages([]);
      setPreviews([]);
      setSuccess('✅ Ticket created successfully!');
      if (onTicketCreated) onTicketCreated(newTicket);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[520px] mx-auto my-6 bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-1 text-indigo-700">Create a Ticket</h2>
      <p className="text-sm text-gray-400 mb-5">Submitted as: <span className="font-medium text-gray-600">{userEmail}</span></p>

      {error && <div className="text-red-500 bg-red-50 border border-red-200 rounded p-2 mb-3 text-sm">{error}</div>}
      {success && <div className="text-green-600 bg-green-50 border border-green-200 rounded p-2 mb-3 text-sm">{success}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {[
          { name: 'resource', placeholder: 'Resource *' },
          { name: 'location', placeholder: 'Location *' },
          { name: 'category', placeholder: 'Category *' },
        ].map(field => (
          <input
            key={field.name}
            name={field.name}
            placeholder={field.placeholder}
            value={formData[field.name]}
            onChange={handleChange}
            required
            className="p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        ))}

        <textarea
          name="description"
          placeholder="Description *"
          value={formData.description}
          onChange={handleChange}
          required
          className="p-2.5 border border-gray-300 rounded-lg text-sm min-h-[90px] focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />

        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="HIGH">🔴 HIGH</option>
          <option value="MEDIUM">🟡 MEDIUM</option>
          <option value="LOW">🟢 LOW</option>
        </select>

        <input
          name="contactDetails"
          placeholder="Email or Phone *"
          value={formData.contactDetails}
          onChange={handleChange}
          required
          className="p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer text-sm transition ${
            isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-indigo-300 bg-slate-50 hover:bg-indigo-50'
          }`}
        >
          <input {...getInputProps()} />
          <p className="text-gray-500">{isDragActive ? 'Drop here...' : '📎 Drag & drop up to 3 images, or click to select'}</p>
        </div>

        {previews.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {previews.map((src, idx) => (
              <div key={idx} className="relative w-[90px] h-[90px]">
                <img src={src} alt={`preview-${idx}`} className="w-full h-full object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >✖</button>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Ticket'}
        </button>
      </form>
    </div>
  );
};

export default TicketForm;