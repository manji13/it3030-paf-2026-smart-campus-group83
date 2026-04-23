import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bookingService from '../../services/bookingService';

export default function BookingList() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState('USER');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const navigate = useNavigate();

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setUserRole(user.role || 'USER');
            fetchBookings(user.role || 'USER');
        } else {
            // Default to user if not logged in
            fetchBookings('USER');
        }
    }, []);

    const fetchBookings = async (role) => {
        try {
            setLoading(true);
            let response;
            if (role === 'ADMIN') {
                response = await bookingService.getAllBookings();
            } else {
                response = await bookingService.getMyBookings();
            }
            setBookings(response.data || []);
        } catch (error) {
            console.error("Error fetching bookings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            try {
                await bookingService.cancelBooking(id);
                fetchBookings(userRole);
            } catch (error) {
                alert(error.response?.data?.error || "Error cancelling booking");
            }
        }
    };

    const handleReview = async (id, status) => {
        const reason = window.prompt(`Please enter a reason for ${status}:`);
        if (reason !== null) {
            try {
                await bookingService.reviewBooking(id, { status, reason });
                fetchBookings(userRole);
            } catch (error) {
                alert(error.response?.data?.error || "Error reviewing booking");
            }
        }
    };

    const filteredBookings = filterStatus === 'ALL' 
        ? bookings 
        : bookings.filter(b => b.status === filterStatus);

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        {userRole === 'ADMIN' ? 'All Bookings' : 'My Bookings'}
                    </h1>
                    <button
                        onClick={() => navigate('/booking/new')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200 transform hover:scale-105"
                    >
                        New Booking
                    </button>
                </div>

                {userRole === 'ADMIN' && (
                    <div className="mb-6 flex gap-4">
                        {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200 ${
                                    filterStatus === status
                                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                                        : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-10 text-center border border-gray-100">
                        <p className="text-gray-500 text-lg">No bookings found.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {filteredBookings.map(booking => (
                            <div key={booking.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                <div className={`h-2 w-full ${
                                    booking.status === 'APPROVED' ? 'bg-green-500' :
                                    booking.status === 'REJECTED' ? 'bg-red-500' :
                                    booking.status === 'CANCELLED' ? 'bg-gray-500' : 'bg-yellow-400'
                                }`}></div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold text-gray-800">Resource: {booking.resourceId}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                            booking.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                            booking.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                            booking.status === 'CANCELLED' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-2 text-sm text-gray-600 mb-6">
                                        <p><span className="font-semibold text-gray-800">Date:</span> {booking.date}</p>
                                        <p><span className="font-semibold text-gray-800">Time:</span> {booking.startTime} - {booking.endTime}</p>
                                        <p><span className="font-semibold text-gray-800">Purpose:</span> {booking.purpose}</p>
                                        <p><span className="font-semibold text-gray-800">Attendees:</span> {booking.expectedAttendees}</p>
                                        {booking.adminReason && (
                                            <p className="mt-2 p-2 bg-gray-50 rounded-md border border-gray-200">
                                                <span className="font-semibold text-gray-800">Admin Note:</span> {booking.adminReason}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                                        {userRole === 'ADMIN' && booking.status === 'PENDING' && (
                                            <>
                                                <button onClick={() => handleReview(booking.id, 'APPROVED')} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors">Approve</button>
                                                <button onClick={() => handleReview(booking.id, 'REJECTED')} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors">Reject</button>
                                            </>
                                        )}
                                        {booking.status !== 'CANCELLED' && booking.status !== 'REJECTED' && (
                                            <button onClick={() => handleCancel(booking.id)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm font-medium transition-colors">Cancel</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
