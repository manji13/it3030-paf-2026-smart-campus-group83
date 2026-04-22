import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const API_BASE_URL = 'http://localhost:8000/api/tickets';

const TicketForm = ({ onTicketCreated }) => {
  const [formData, setFormData] = useState({
    resource: '',
    location: '',
    category: '',
    description: '',
    priority: 'MEDIUM',
    contactDetails: '',
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    const newImages = [...images, ...acceptedFiles].slice(0, 3);
    setImages(newImages);
    const newPreviews = newImages.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  }, [images]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 3,
  });

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    const newPreviews = newImages.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formDataToSend = new FormData();
    const ticketBlob = new Blob([JSON.stringify(formData)], { type: 'application/json' });
    formDataToSend.append('ticket', ticketBlob);
    images.forEach((image) => {
      formDataToSend.append('images', image);
    });

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        body: formDataToSend,
      });
      if (!response.ok) throw new Error('Upload failed');
      const newTicket = await response.json();
      setFormData({
        resource: '',
        location: '',
        category: '',
        description: '',
        priority: 'MEDIUM',
        contactDetails: '',
      });
      setImages([]);
      setPreviews([]);
      if (onTicketCreated) onTicketCreated(newTicket);
      alert('Ticket created successfully!');
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[500px] mx-auto my-5">
      <h2 className="text-2xl font-bold mb-4">Create Ticket</h2>
      {error && <div className="text-red-500 mb-3">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          name="resource"
          placeholder="Resource *"
          value={formData.resource}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded"
        />
        <input
          name="location"
          placeholder="Location *"
          value={formData.location}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded"
        />
        <input
          name="category"
          placeholder="Category *"
          value={formData.category}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded"
        />
        <textarea
          name="description"
          placeholder="Description *"
          value={formData.description}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded min-h-[80px]"
        />
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="HIGH">HIGH</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="LOW">LOW</option>
        </select>
        <input
          name="contactDetails"
          placeholder="Email or Phone *"
          value={formData.contactDetails}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded"
        />

        {/* Drag & Drop Area */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded p-5 text-center cursor-pointer ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-blue-400 bg-blue-50'
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the images here...</p>
          ) : (
            <p>Drag & drop up to 3 images here, or click to select</p>
          )}
        </div>

        {/* Image Previews */}
        {previews.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {previews.map((src, idx) => (
              <div key={idx} className="relative w-[100px] h-[100px]">
                <img
                  src={src}
                  alt={`preview-${idx}`}
                  className="w-full h-full object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs border-none cursor-pointer"
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white p-2 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Ticket'}
        </button>
      </form>
    </div>
  );
};

export default TicketForm;