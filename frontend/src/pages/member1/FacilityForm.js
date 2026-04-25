import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import facilityService from '../../services/facilityService';

function FacilityForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        name: '',
        type: 'LECTURE_HALL',
        capacity: '',
        location: '',
        availabilityWindows: '',
        status: 'ACTIVE'
    });

    useEffect(() => {
        // Guard: only ADMIN can add/edit facilities
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.token) {
            alert('Please log in to manage facilities.');
            navigate('/login');
            return;
        }
        const role = (user.role || '').toUpperCase();
        if (role !== 'ADMIN') {
            alert('Only administrators can add or edit facilities.');
            navigate('/facilities');
            return;
        }
        if (isEditMode) {
            fetchFacility();
        }
    }, [id]);

    const fetchFacility = async () => {
        try {
            const response = await facilityService.getFacilityById(id);
            const data = response.data;
            setFormData({
                ...data,
                availabilityWindows: data.availabilityWindows ? data.availabilityWindows.join(', ') : ''
            });
        } catch (error) {
            console.error('Error fetching facility', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const payload = {
            ...formData,
            capacity: parseInt(formData.capacity) || 0,
            availabilityWindows: formData.availabilityWindows.split(',').map(window => window.trim()).filter(Boolean)
        };

        try {
            if (isEditMode) {
                await facilityService.updateFacility(id, payload);
            } else {
                await facilityService.createFacility(payload);
            }
            navigate('/facilities');
        } catch (error) {
            console.error('Error saving facility', error);
            const status = error.response?.status;
            if (status === 403) {
                alert('Access denied. You must be logged in as an Admin to save facilities.\nPlease log in and try again.');
                navigate('/login');
                return;
            }
            // Show actual backend validation errors if available
            const errData = error.response?.data;
            if (errData?.data && typeof errData.data === 'object') {
                const messages = Object.values(errData.data).join('\n');
                alert('Validation errors:\n' + messages);
            } else {
                alert(errData?.message || 'Failed to save facility. Please check all required fields.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8 flex justify-center items-start pt-20">
            <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                        {isEditMode ? 'Edit Resource' : 'Add New Resource'}
                    </h1>
                    <Link to="/facilities" className="text-gray-400 hover:text-white transition-colors">
                        ✕ Cancel
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Resource Name</label>
                        <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-400" placeholder="e.g. Auditorium A"/>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                            <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-400">
                                <option value="LECTURE_HALL">Lecture Hall</option>
                                <option value="LAB">Lab</option>
                                <option value="MEETING_ROOM">Meeting Room</option>
                                <option value="EQUIPMENT">Equipment</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-400">
                                <option value="ACTIVE">Active</option>
                                <option value="OUT_OF_SERVICE">Out of Service</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Capacity</label>
                            <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-400" placeholder="e.g. 50"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                            <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-400" placeholder="e.g. Block C, Floor 2"/>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                            Availability Windows (Comma separated) <span className="text-red-400">*</span>
                        </label>
                        <input
                            required
                            type="text"
                            name="availabilityWindows"
                            value={formData.availabilityWindows}
                            onChange={handleChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                            placeholder="e.g. Mon 9-5, Tue 10-4  (at least one required)"
                        />
                        <p className="text-xs text-gray-500 mt-1">Enter time slots separated by commas</p>
                    </div>

                    <button type="submit" className="w-full py-4 bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg shadow-lg hover:shadow-cyan-500/50 transform hover:-translate-y-1 transition-all duration-300 font-bold text-lg mt-4">
                        {isEditMode ? 'Update Resource' : 'Save Resource'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default FacilityForm;
