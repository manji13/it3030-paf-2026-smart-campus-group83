import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserNav from '../../components/UserNav';
import facilityService from '../../services/facilityService';

const TYPE_ICONS = {
    LECTURE_HALL: '🏛️',
    LAB: '🔬',
    MEETING_ROOM: '🤝',
    EQUIPMENT: '⚙️',
};
const TYPE_LABELS = {
    LECTURE_HALL: 'Lecture Hall',
    LAB: 'Lab',
    MEETING_ROOM: 'Meeting Room',
    EQUIPMENT: 'Equipment',
};

export default function UserResourcesPage() {
    const navigate = useNavigate();
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ name: '', type: '', location: '' });
    const [pageLoaded, setPageLoaded] = useState(false);

    useEffect(() => {
        setPageLoaded(true);
        fetchFacilities();
    }, []);

    const fetchFacilities = async () => {
        setLoading(true);
        try {
            const res = await facilityService.getFacilities({});
            setFacilities(res.data?.data || []);
        } catch (err) {
            console.error('Error fetching resources', err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = facilities.filter((f) => {
        const nameMatch = f.name?.toLowerCase().includes(filters.name.toLowerCase());
        const typeMatch = !filters.type || f.type === filters.type;
        const locMatch  = f.location?.toLowerCase().includes(filters.location.toLowerCase());
        return nameMatch && typeMatch && locMatch;
    });

    const activeCount   = facilities.filter((f) => f.status === 'ACTIVE').length;
    const inactiveCount = facilities.filter((f) => f.status !== 'ACTIVE').length;

    return (
        <div className={`min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 transition-opacity duration-700 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <UserNav />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* ── Header ─────────────────────────────────────────────── */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md text-xl">
                            🏢
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold text-gray-900">Campus Resources</h1>
                            <p className="text-gray-500 text-sm">Browse available facilities and assets on campus.</p>
                        </div>
                    </div>

                    {/* Summary chips */}
                    {!loading && (
                        <div className="flex gap-3 mt-4 flex-wrap">
                            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
                                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                                <span className="text-sm font-medium text-gray-600">Total</span>
                                <span className="text-sm font-bold text-gray-900">{facilities.length}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                <span className="text-sm font-medium text-gray-600">Available</span>
                                <span className="text-sm font-bold text-gray-900">{activeCount}</span>
                            </div>
                            {inactiveCount > 0 && (
                                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                    <span className="text-sm font-medium text-gray-600">Out of Service</span>
                                    <span className="text-sm font-bold text-gray-900">{inactiveCount}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* ── Filters ────────────────────────────────────────────── */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 mb-8">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Search &amp; Filter</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search by name…"
                                value={filters.name}
                                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                            />
                        </div>
                        <select
                            value={filters.type}
                            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Types</option>
                            <option value="LECTURE_HALL">Lecture Hall</option>
                            <option value="LAB">Lab</option>
                            <option value="MEETING_ROOM">Meeting Room</option>
                            <option value="EQUIPMENT">Equipment</option>
                        </select>
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Filter by location…"
                                value={filters.location}
                                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                            />
                        </div>
                    </div>
                </div>

                {/* ── Content ────────────────────────────────────────────── */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <div className="relative w-14 h-14">
                            <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
                            <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 animate-spin" />
                        </div>
                        <p className="text-gray-500 text-sm">Loading resources…</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center text-4xl mb-4">🏢</div>
                        <p className="text-gray-700 font-semibold text-lg">No resources found</p>
                        <p className="text-gray-400 text-sm mt-1">
                            {facilities.length === 0
                                ? 'No campus resources have been added yet.'
                                : 'Try adjusting your search filters.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((facility) => (
                            <div
                                key={facility.id}
                                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300"
                            >
                                {/* Top accent bar */}
                                <div className={`h-1.5 ${facility.status === 'ACTIVE' ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-gray-300 to-gray-400'}`} />

                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl group-hover:bg-indigo-100 transition-colors">
                                                {TYPE_ICONS[facility.type] || '🏢'}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors leading-tight">
                                                    {facility.name}
                                                </h3>
                                                <p className="text-xs text-gray-500 mt-0.5">{TYPE_LABELS[facility.type] || facility.type}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                            facility.status === 'ACTIVE'
                                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                : 'bg-red-50 text-red-500 border border-red-100'
                                        }`}>
                                            {facility.status === 'ACTIVE' ? 'Available' : 'Unavailable'}
                                        </span>
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-2 text-sm">
                                        {facility.location && (
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <svg className="w-4 h-4 shrink-0 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span>{facility.location}</span>
                                            </div>
                                        )}
                                        {facility.capacity > 0 && (
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <svg className="w-4 h-4 shrink-0 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span>Capacity: <strong className="text-gray-700">{facility.capacity}</strong> pax</span>
                                            </div>
                                        )}
                                        {facility.availabilityWindows?.length > 0 && (
                                            <div className="mt-3 pt-3 border-t border-gray-100">
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Availability</p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {facility.availabilityWindows.map((window, idx) => (
                                                        <span key={idx}
                                                            className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-lg font-medium border border-indigo-100">
                                                            {window}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Book CTA (optional) */}
                                    {facility.status === 'ACTIVE' && (
                                        <button
                                            onClick={() => navigate('/booking/new')}
                                            className="mt-5 w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold transition-all shadow-sm hover:shadow-md transform hover:scale-[1.01] active:scale-[0.99]"
                                        >
                                            Book Now
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}