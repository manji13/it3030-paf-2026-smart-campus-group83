import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import UserNav from '../../components/UserNav';

const API_BASE_URL = 'http://localhost:8000/api/v1/member3/tickets';

const FIELD_ICON = {
  resource: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 5h1" />,
  location: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />,
  category: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />,
  contactDetails: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
};

function FieldIcon({ name }) {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {FIELD_ICON[name] || <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
    </svg>
  );
}

const TicketForm = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userEmail = user.email || '';

  const [formData, setFormData] = useState({
    resource: '', location: '', category: '',
    description: '', priority: 'MEDIUM', contactDetails: userEmail,
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onDrop = useCallback((accepted) => {
    const merged = [...images, ...accepted].slice(0, 3);
    setImages(merged);
    setPreviews(merged.map(f => URL.createObjectURL(f)));
  }, [images]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': [] }, maxFiles: 3,
  });

  const removeImage = (i) => {
    const next = images.filter((_, idx) => idx !== i);
    setImages(next);
    setPreviews(next.map(f => URL.createObjectURL(f)));
  };

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    const payload = {
        resourceId: formData.resource,
        location: formData.location,
        category: formData.category,
        description: formData.description,
        priority: formData.priority,
        preferredContact: formData.contactDetails,
        attachments: []
    };
    const formDataToSend = new FormData();
    formDataToSend.append('ticket', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
    images.forEach(img => formDataToSend.append('images', img));

    try {
      const token = localStorage.getItem('sch_token');
      const res = await fetch(API_BASE_URL, { 
        method: 'POST', 
        headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: formDataToSend
      });
      if (!res.ok) throw new Error('Failed to create ticket');
      await res.json();
      setSuccess('Ticket submitted! Redirecting…');
      setFormData({ resource: '', location: '', category: '', description: '', priority: 'MEDIUM', contactDetails: userEmail });
      setImages([]); setPreviews([]);
      setTimeout(() => navigate('/my-tickets'), 1800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full pl-10 pr-4 py-3 bg-white/60 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:border-indigo-400 backdrop-blur-sm transition-all";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-purple-50 dark:bg-gray-900">
      <UserNav />

      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-300 rounded-full filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 -left-24 w-80 h-80 bg-purple-300 rounded-full filter blur-3xl opacity-15 animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-xl mx-auto px-4 py-10">

        {/* Page header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Create a Ticket</h1>
            <p className="text-xs text-gray-400 mt-0.5">Submitting as <span className="text-indigo-500 font-semibold">{userEmail}</span></p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-white/60 dark:border-gray-700/60 rounded-3xl shadow-xl shadow-indigo-100/30 p-8">

          {/* Alerts */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3 mb-5">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm rounded-xl p-3 mb-5">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Text fields */}
            {[
              { name: 'resource', placeholder: 'Resource *', label: 'Resource' },
              { name: 'location', placeholder: 'Location *', label: 'Location' },
              { name: 'category', placeholder: 'Category *', label: 'Category' },
              { name: 'contactDetails', placeholder: 'Contact Email / Phone *', label: 'Contact' },
            ].map(f => (
              <div key={f.name}>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">{f.label}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FieldIcon name={f.name} />
                  </span>
                  <input name={f.name} placeholder={f.placeholder} value={formData[f.name]}
                    onChange={handleChange} required className={inputCls} />
                </div>
              </div>
            ))}

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Description</label>
              <textarea name="description" placeholder="Describe the issue in detail…" value={formData.description}
                onChange={handleChange} required rows={4}
                className="w-full px-4 py-3 bg-white/60 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/60 resize-none transition-all" />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Priority</label>
              <div className="flex gap-2">
                {[['HIGH', '🔴', 'red'], ['MEDIUM', '🟡', 'amber'], ['LOW', '🟢', 'emerald']].map(([val, emoji, color]) => (
                  <button key={val} type="button" onClick={() => setFormData(p => ({ ...p, priority: val }))}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${formData.priority === val
                      ? color === 'red' ? 'bg-red-500 border-red-500 text-white shadow-md shadow-red-200'
                        : color === 'amber' ? 'bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-200'
                          : 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-200'
                      : 'bg-transparent border-gray-200 dark:border-gray-600 text-gray-500 hover:border-gray-300'
                      }`}>
                    {emoji} {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Dropzone */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">
                Attachments <span className="text-gray-400 font-normal normal-case">(up to 3 images)</span>
              </label>
              <div {...getRootProps()}
                className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${isDragActive
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 scale-[1.01]'
                  : 'border-indigo-200 dark:border-indigo-800/50 bg-indigo-50/30 dark:bg-gray-800/30 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 hover:border-indigo-400'
                  }`}>
                <input {...getInputProps()} />
                <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isDragActive ? 'Drop images here…' : 'Drag & drop images, or click to browse'}
                </p>
                <p className="text-xs text-gray-400 mt-1">{images.length}/3 added</p>
              </div>

              {previews.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-3">
                  {previews.map((src, idx) => (
                    <div key={idx} className="relative w-[88px] h-[88px] group">
                      <img src={src} alt={`preview-${idx}`} className="w-full h-full object-cover rounded-xl border-2 border-indigo-100" />
                      <button type="button" onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow transition-all opacity-0 group-hover:opacity-100">
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="relative w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm mt-1">
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  Submit Ticket
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TicketForm;