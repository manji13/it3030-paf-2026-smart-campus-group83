import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bookingService from '../../services/bookingService';
import facilityService from '../../services/facilityService';

export default function BookingForm() {
    const navigate = useNavigate();
    const [facilities, setFacilities] = useState([]);
    const [formData, setFormData] = useState({
        resourceId: '',
        date: '',
        startTime: '',
        endTime: '',
        purpose: '',
        expectedAttendees: 1
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFacilities = async () => {
            try {
                const response = await facilityService.getFacilities();
                setFacilities(response.data || []);
                if (response.data?.length > 0) {
                    setFormData(prev => ({ ...prev, resourceId: response.data[0].id }));
                }
            } catch (err) {
                console.error("Failed to fetch facilities", err);
            }
        };
        fetchFacilities();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await bookingService.createBooking({
                ...formData,
                expectedAttendees: parseInt(formData.expectedAttendees, 10)
            });
            navigate('/booking');
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.message || "Failed to create booking");
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-150 placeholder-gray-400";

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-12 font-sans">
            <div className="w-full max-w-md">

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                    {/* Dark header */}
                    <div className="bg-[#1a1a2e] px-8 py-7 relative">
                        <span className="absolute top-5 right-5 inline-flex items-center gap-1.5 text-[11px] bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block"></span>
                            Available now
                        </span>
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                                <rect x="3" y="4" width="18" height="18" rx="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                        </div>
                        <h1 className="text-[22px] text-white font-serif font-normal tracking-tight">Reserve a Resource</h1>
                        <p className="text-sm text-white/50 mt-1">Choose a facility and fill in your booking details.</p>
                    </div>

                    {/* Form body */}
                    <form onSubmit={handleSubmit} className="px-8 py-7 space-y-5">

                        {error && (
                            <div className="flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-lg">
                                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </div>
                        )}

                        {/* Facility */}
                        <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">Facility</label>
                            <select name="resourceId" required value={formData.resourceId} onChange={handleChange}
                                className={inputClass + " appearance-none cursor-pointer"}>
                                {facilities.map(fac => (
                                    <option key={fac.id} value={fac.id}>{fac.name} ({fac.type})</option>
                                ))}
                            </select>
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">Date</label>
                            <input type="date" name="date" required value={formData.date} onChange={handleChange} className={inputClass} />
                        </div>

                        {/* Start / End time */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">Start time</label>
                                <input type="time" name="startTime" required value={formData.startTime} onChange={handleChange} className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">End time</label>
                                <input type="time" name="endTime" required value={formData.endTime} onChange={handleChange} className={inputClass} />
                            </div>
                        </div>

                        {/* Purpose */}
                        <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">Purpose</label>
                            <textarea name="purpose" rows={3} required value={formData.purpose} onChange={handleChange}
                                placeholder="Briefly describe your booking purpose..."
                                className={inputClass + " resize-none"} />
                        </div>

                        {/* Attendees */}
                        <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">Expected attendees</label>
                            <input type="number" name="expectedAttendees" min="1" required
                                value={formData.expectedAttendees} onChange={handleChange} className={inputClass} />
                        </div>

                        <hr className="border-gray-100" />

                        {/* Actions */}
                        <div className="flex gap-3 pt-1">
                            <button type="button" onClick={() => navigate('/booking')}
                                className="flex-1 py-2.5 px-4 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-150">
                                Cancel
                            </button>
                            <button type="submit" disabled={loading}
                                className="flex-[2] py-2.5 px-4 text-sm font-medium text-white bg-[#1a1a2e] rounded-lg hover:bg-[#2a2a4e] disabled:opacity-50 transition-colors duration-150">
                                {loading ? 'Submitting...' : 'Submit request →'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}