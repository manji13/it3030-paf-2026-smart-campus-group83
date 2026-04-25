import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import facilityService from '../../services/facilityService';

function FacilityCatalogue() {
    const [facilities, setFacilities] = useState([]);
    const [filters, setFilters] = useState({ name: '', type: '', minCapacity: '', location: '' });

    useEffect(() => {
        fetchFacilities();
    }, [filters]);

    const fetchFacilities = async () => {
        try {
            // Remove empty filters
            const params = {};
            Object.keys(filters).forEach(key => {
                if (filters[key]) params[key] = filters[key];
            });
            const response = await facilityService.getFacilities(params);
            setFacilities(response.data?.data || []);
        } catch (error) {
            console.error('Error fetching facilities', error);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this resource?')) {
            try {
                await facilityService.deleteFacility(id);
                fetchFacilities();
            } catch (error) {
                console.error('Error deleting facility', error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                        Facilities & Assets Catalogue
                    </h1>
                    <Link to="/facilities/new" className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg shadow-lg hover:shadow-cyan-500/50 transform hover:-translate-y-1 transition-all duration-300 font-semibold">
                        + Add Resource
                    </Link>
                </div>

                <div className="bg-gray-800 p-6 rounded-2xl shadow-xl mb-8 border border-gray-700">
                    <h2 className="text-xl font-bold mb-4 text-cyan-400">Search & Filters</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                            type="text"
                            name="name"
                            placeholder="Resource Name..."
                            value={filters.name}
                            onChange={handleFilterChange}
                            className="bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 transition-shadow"
                        />
                        <select
                            name="type"
                            value={filters.type}
                            onChange={handleFilterChange}
                            className="bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 transition-shadow"
                        >
                            <option value="">All Types</option>
                            <option value="LECTURE_HALL">Lecture Hall</option>
                            <option value="LAB">Lab</option>
                            <option value="MEETING_ROOM">Meeting Room</option>
                            <option value="EQUIPMENT">Equipment</option>
                        </select>
                        <input
                            type="number"
                            name="minCapacity"
                            placeholder="Min Capacity..."
                            value={filters.minCapacity}
                            onChange={handleFilterChange}
                            className="bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 transition-shadow"
                        />
                        <input
                            type="text"
                            name="location"
                            placeholder="Location..."
                            value={filters.location}
                            onChange={handleFilterChange}
                            className="bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 transition-shadow"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {facilities.map((facility) => (
                        <div key={facility.id} className="group bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 border border-gray-700 hover:border-cyan-500/50">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl font-bold text-gray-100 group-hover:text-cyan-400 transition-colors">{facility.name}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${facility.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {facility.status}
                                    </span>
                                </div>
                                <div className="space-y-2 text-gray-400 mb-6 font-medium">
                                    <p className="flex justify-between"><span>Type:</span> <span className="text-gray-200">{facility.type}</span></p>
                                    {facility.capacity && facility.capacity > 0 && (
                                        <p className="flex justify-between"><span>Capacity:</span> <span className="text-gray-200">{facility.capacity} pax</span></p>
                                    )}
                                    <p className="flex justify-between"><span>Location:</span> <span className="text-gray-200">{facility.location}</span></p>
                                </div>
                                <div className="flex justify-between pt-4 border-t border-gray-700">
                                    <Link to={`/facilities/edit/${facility.id}`} className="text-teal-400 hover:text-teal-300 font-semibold transition-colors">
                                        Edit Details
                                    </Link>
                                    <button onClick={() => handleDelete(facility.id)} className="text-red-400 hover:text-red-300 font-semibold transition-colors">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {facilities.length === 0 && (
                        <div className="col-span-1 border-t border-gray-700 md:col-span-full text-center py-12 text-gray-500">
                            No facilities found matching your criteria.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FacilityCatalogue;
