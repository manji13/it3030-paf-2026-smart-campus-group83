import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNav from '../../components/AdminNav';
import facilityService from '../../services/facilityService';

/* ── Inline FacilityForm Modal ─────────────────────────────────────────── */
function FacilityModal({ facility, onClose, onSaved }) {
    const isEdit = Boolean(facility?.id);
    const [formData, setFormData] = useState({
        name: facility?.name || '',
        type: facility?.type || 'LECTURE_HALL',
        capacity: facility?.capacity || '',
        location: facility?.location || '',
        availabilityWindows: facility?.availabilityWindows?.join(', ') || '',
        status: facility?.status || 'ACTIVE',
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        const payload = {
            ...formData,
            capacity: parseInt(formData.capacity) || 0,
            availabilityWindows: formData.availabilityWindows
                .split(',').map((w) => w.trim()).filter(Boolean),
        };
        try {
            if (isEdit) {
                await facilityService.updateFacility(facility.id, payload);
            } else {
                await facilityService.createFacility(payload);
            }
            onSaved();
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to save resource.';
            setError(msg);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8 animate-fadeIn">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
                        {isEdit ? 'Edit Resource' : 'Add New Resource'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-xl leading-none">✕</button>
                </div>

                {error && (
                    <div className="mb-4 px-4 py-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-300 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Resource Name *</label>
                        <input
                            required type="text" name="name" value={formData.name} onChange={handleChange}
                            placeholder="e.g. Auditorium A"
                            className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Type</label>
                            <select name="type" value={formData.type} onChange={handleChange}
                                className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                                <option value="LECTURE_HALL">Lecture Hall</option>
                                <option value="LAB">Lab</option>
                                <option value="MEETING_ROOM">Meeting Room</option>
                                <option value="EQUIPMENT">Equipment</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Status</label>
                            <select name="status" value={formData.status} onChange={handleChange}
                                className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                                <option value="ACTIVE">Active</option>
                                <option value="OUT_OF_SERVICE">Out of Service</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Capacity</label>
                            <input type="number" name="capacity" value={formData.capacity} onChange={handleChange}
                                placeholder="e.g. 50"
                                className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Location</label>
                            <input type="text" name="location" value={formData.location} onChange={handleChange}
                                placeholder="e.g. Block C, Floor 2"
                                className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                            Availability Windows * <span className="text-gray-500 normal-case text-xs font-normal">(comma separated)</span>
                        </label>
                        <input required type="text" name="availabilityWindows" value={formData.availabilityWindows} onChange={handleChange}
                            placeholder="e.g. Mon 9-5, Tue 10-4"
                            className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors font-semibold">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving}
                            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold hover:from-teal-600 hover:to-blue-700 transition-all disabled:opacity-60 shadow-lg">
                            {saving ? 'Saving…' : (isEdit ? 'Update Resource' : 'Save Resource')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ── Delete Confirm Dialog ─────────────────────────────────────────────── */
function ConfirmDialog({ name, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl p-8 w-full max-w-sm animate-fadeIn text-center">
                <div className="w-14 h-14 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Delete Resource?</h3>
                <p className="text-gray-400 text-sm mb-6">
                    Are you sure you want to delete <span className="text-white font-semibold">"{name}"</span>? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                    <button onClick={onCancel}
                        className="flex-1 py-2.5 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors font-semibold">
                        Cancel
                    </button>
                    <button onClick={onConfirm}
                        className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

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

/* ── Main AdminFacilitiesPage ──────────────────────────────────────────── */
export default function AdminFacilitiesPage() {
    const navigate = useNavigate();
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ name: '', type: '', location: '' });
    const [modalFacility, setModalFacility] = useState(null); // null = closed, {} = add, {...} = edit
    const [deleteTarget, setDeleteTarget] = useState(null);
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
            console.error('Error fetching facilities', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await facilityService.deleteFacility(deleteTarget.id);
            setDeleteTarget(null);
            fetchFacilities();
        } catch (err) {
            console.error('Error deleting facility', err);
        }
    };

    const filtered = facilities.filter((f) => {
        const nameMatch = f.name?.toLowerCase().includes(filters.name.toLowerCase());
        const typeMatch = !filters.type || f.type === filters.type;
        const locMatch  = f.location?.toLowerCase().includes(filters.location.toLowerCase());
        return nameMatch && typeMatch && locMatch;
    });

    return (
        <div className={`min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900 transition-opacity duration-700 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <AdminNav />

            {/* Ambient blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal-700 rounded-full filter blur-3xl opacity-10 animate-pulse" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-700 rounded-full filter blur-3xl opacity-10 animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* ── Header ─────────────────────────────────────────────────── */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-white">
                            Facilities &amp;{' '}
                            <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                                Resources
                            </span>
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">Manage campus facilities and assets.</p>
                    </div>
                    <button
                        id="admin-facilities-add-btn"
                        onClick={() => setModalFacility({})}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-semibold transition-all shadow-lg shadow-teal-900/40 hover:-translate-y-0.5"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Resource
                    </button>
                </div>

                {/* ── Filters ────────────────────────────────────────────────── */}
                <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-5 shadow-xl mb-8">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Search &amp; Filter</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Search by name…"
                            value={filters.name}
                            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                            className="bg-gray-700 border border-gray-600 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow text-sm"
                        />
                        <select
                            value={filters.type}
                            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                            className="bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        >
                            <option value="">All Types</option>
                            <option value="LECTURE_HALL">Lecture Hall</option>
                            <option value="LAB">Lab</option>
                            <option value="MEETING_ROOM">Meeting Room</option>
                            <option value="EQUIPMENT">Equipment</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Filter by location…"
                            value={filters.location}
                            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                            className="bg-gray-700 border border-gray-600 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow text-sm"
                        />
                    </div>
                </div>

                {/* ── Content ────────────────────────────────────────────────── */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 rounded-full border-4 border-teal-900/40" />
                            <div className="absolute inset-0 rounded-full border-4 border-t-teal-500 animate-spin" />
                        </div>
                        <p className="text-gray-400 text-sm">Loading facilities…</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="w-20 h-20 bg-gray-800/60 rounded-2xl flex items-center justify-center text-4xl mb-4">🏢</div>
                        <p className="text-gray-300 font-semibold text-lg">No facilities found</p>
                        <p className="text-gray-500 text-sm mt-1">
                            {facilities.length === 0
                                ? 'Click "Add Resource" to create your first facility.'
                                : 'Try adjusting your search filters.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((facility) => (
                            <div
                                key={facility.id}
                                className="group bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-teal-500/10 hover:border-teal-500/40 transition-all duration-300"
                            >
                                {/* Card top accent */}
                                <div className="h-1.5 bg-gradient-to-r from-teal-500 to-emerald-500" />

                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">{TYPE_ICONS[facility.type] || '🏢'}</span>
                                            <div>
                                                <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors leading-tight">
                                                    {facility.name}
                                                </h3>
                                                <p className="text-xs text-gray-400 mt-0.5">{TYPE_LABELS[facility.type] || facility.type}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                            facility.status === 'ACTIVE'
                                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                        }`}>
                                            {facility.status === 'ACTIVE' ? 'Active' : 'Out of Service'}
                                        </span>
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-2 text-sm mb-5">
                                        {facility.location && (
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="text-gray-300">{facility.location}</span>
                                            </div>
                                        )}
                                        {facility.capacity > 0 && (
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="text-gray-300">Capacity: {facility.capacity} pax</span>
                                            </div>
                                        )}
                                        {facility.availabilityWindows?.length > 0 && (
                                            <div className="flex items-start gap-2 text-gray-400">
                                                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-gray-300 text-xs leading-relaxed">
                                                    {facility.availabilityWindows.join(' · ')}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-4 border-t border-gray-700/50">
                                        <button
                                            id={`admin-edit-facility-${facility.id}`}
                                            onClick={() => setModalFacility(facility)}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 hover:text-teal-300 text-sm font-semibold transition-colors border border-teal-500/20 hover:border-teal-500/40"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Edit
                                        </button>
                                        <button
                                            id={`admin-delete-facility-${facility.id}`}
                                            onClick={() => setDeleteTarget(facility)}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-sm font-semibold transition-colors border border-red-500/20 hover:border-red-500/40"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Modals ─────────────────────────────────────────────────────── */}
            {modalFacility !== null && (
                <FacilityModal
                    facility={modalFacility}
                    onClose={() => setModalFacility(null)}
                    onSaved={() => { setModalFacility(null); fetchFacilities(); }}
                />
            )}
            {deleteTarget && (
                <ConfirmDialog
                    name={deleteTarget.name}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
                    .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
                `
            }} />
        </div>
    );
}