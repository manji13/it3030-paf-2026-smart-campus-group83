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
                if (response.data && response.data.length > 0) {
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

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="mx-auto h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
                    <svg className="h-8 w-8 text-white transform -rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
                    Request a Resource
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Fill out the details below to book a facility.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="resourceId" className="block text-sm font-medium text-gray-700">Resource</label>
                            <div className="mt-1">
                                <select
                                    id="resourceId"
                                    name="resourceId"
                                    required
                                    value={formData.resourceId}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200 bg-white"
                                >
                                    {facilities.map(fac => (
                                        <option key={fac.id} value={fac.id}>{fac.name} ({fac.type})</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                            <div className="mt-1">
                                <input
                                    id="date"
                                    name="date"
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
                                <div className="mt-1">
                                    <input
                                        id="startTime"
                                        name="startTime"
                                        type="time"
                                        required
                                        value={formData.startTime}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
                                <div className="mt-1">
                                    <input
                                        id="endTime"
                                        name="endTime"
                                        type="time"
                                        required
                                        value={formData.endTime}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">Purpose</label>
                            <div className="mt-1">
                                <textarea
                                    id="purpose"
                                    name="purpose"
                                    rows="3"
                                    required
                                    value={formData.purpose}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                                    placeholder="Briefly describe the purpose of your booking..."
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="expectedAttendees" className="block text-sm font-medium text-gray-700">Expected Attendees</label>
                            <div className="mt-1">
                                <input
                                    id="expectedAttendees"
                                    name="expectedAttendees"
                                    type="number"
                                    min="1"
                                    required
                                    value={formData.expectedAttendees}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/booking')}
                                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                            >
                                {loading ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
