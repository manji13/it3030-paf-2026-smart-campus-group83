import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bookingService from '../../services/bookingService';
import AdminNav from '../../components/AdminNav';

export default function BookingList() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState('USER');
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const navigate = useNavigate();

    useEffect(() => {
        const userStr = localStorage.getItem('sch_user');
        if (userStr) {
            const user = JSON.parse(userStr);
            const roles = user.roles || ['USER'];
            const isAdmin = roles.includes('ADMIN');
            setUserRole(isAdmin ? 'ADMIN' : 'USER');
            setUserName(user.name || '');
            setUserEmail(user.email || '');
            
            if (window.location.pathname === '/admin-page/bookinglist' && !isAdmin) {
                navigate('/booking');
                return;
            }
            
            fetchBookings(isAdmin ? 'ADMIN' : 'USER');
        } else {
            if (window.location.pathname === '/admin-page/bookinglist') {
                navigate('/login');
                return;
            }
            fetchBookings('USER');
        }
    }, [navigate]);

    const fetchBookings = async (role) => {
        try {
            setLoading(true);
            let response;
            if (role === 'ADMIN') {
                response = await bookingService.getAllBookings();
            } else {
                response = await bookingService.getMyBookings();
            }
            setBookings(response.data?.data || []);
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

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete (reject) this booking?")) {
            try {
                await bookingService.reviewBooking(id, { status: 'REJECTED', reason: 'Deleted by admin' });
                fetchBookings(userRole);
            } catch (error) {
                alert(error.response?.data?.error || "Error deleting booking");
            }
        }
    };

    const filteredBookings = filterStatus === 'ALL' 
        ? bookings 
        : bookings.filter(b => b.status === filterStatus);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {userRole === 'ADMIN' && (
                <AdminNav 
                    userName={userName} 
                    userEmail={userEmail} 
                    onLogout={handleLogout} 
                />
            )}
            <div className="py-10 px-4 sm:px-6 lg:px-8">
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
                ) : userRole === 'ADMIN' ? (
                    <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Resource</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Time</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Purpose</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Attendees</th>
                                        <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredBookings.map(booking => (
                                        <tr key={booking.id} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{booking.resourceId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border shadow-sm ${
                                                    booking.status === 'APPROVED' ? 'bg-green-100 text-green-800 border-green-200' :
                                                    booking.status === 'REJECTED' ? 'bg-red-100 text-red-800 border-red-200' :
                                                    booking.status === 'CANCELLED' ? 'bg-gray-100 text-gray-800 border-gray-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                                }`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                <div className="font-medium text-gray-900">{booking.date}</div>
                                                <div className="text-xs text-gray-500 mt-1">{booking.startTime} - {booking.endTime}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                                                <div className="truncate font-medium text-gray-800" title={booking.purpose}>{booking.purpose}</div>
                                                {booking.adminReason && <div className="text-xs text-indigo-600 mt-1 italic truncate" title={booking.adminReason}>Note: {booking.adminReason}</div>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">{booking.expectedAttendees}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    {booking.status === 'PENDING' && (
                                                        <>
                                                            <button onClick={() => handleReview(booking.id, 'APPROVED')} className="text-green-700 bg-green-100 hover:bg-green-200 hover:text-green-900 px-3 py-1.5 rounded-lg transition-colors font-semibold shadow-sm">Approve</button>
                                                            <button onClick={() => handleReview(booking.id, 'REJECTED')} className="text-red-700 bg-red-100 hover:bg-red-200 hover:text-red-900 px-3 py-1.5 rounded-lg transition-colors font-semibold shadow-sm">Reject</button>
                                                        </>
                                                    )}
                                                    <button onClick={() => navigate(`/booking/edit/${booking.id}`)} className="text-blue-700 bg-blue-100 hover:bg-blue-200 hover:text-blue-900 px-3 py-1.5 rounded-lg transition-colors font-semibold shadow-sm">Edit</button>
                                                    <button onClick={() => handleDelete(booking.id)} className="text-gray-700 bg-gray-200 hover:bg-gray-300 hover:text-gray-900 px-3 py-1.5 rounded-lg transition-colors font-semibold shadow-sm">Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {filteredBookings.map(booking => (
                            <div key={booking.id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row">
                                <div className={`w-full md:w-2 h-2 md:h-auto ${
                                    booking.status === 'APPROVED' ? 'bg-green-500' :
                                    booking.status === 'REJECTED' ? 'bg-red-500' :
                                    booking.status === 'CANCELLED' ? 'bg-gray-500' : 'bg-yellow-400'
                                }`}></div>
                                <div className="p-6 flex-1 flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
                                    <div className="flex-1 w-full">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-gray-800">Resource: {booking.resourceId}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                                booking.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                booking.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                booking.status === 'CANCELLED' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600">
                                            <p><span className="font-semibold text-gray-800">Date:</span> {booking.date}</p>
                                            <p><span className="font-semibold text-gray-800">Time:</span> {booking.startTime} - {booking.endTime}</p>
                                            <p className="md:col-span-2"><span className="font-semibold text-gray-800">Purpose:</span> {booking.purpose}</p>
                                            <p className="md:col-span-2"><span className="font-semibold text-gray-800">Attendees:</span> {booking.expectedAttendees}</p>
                                            {booking.adminReason && (
                                                <p className="mt-2 p-2 bg-gray-50 rounded-md border border-gray-200 md:col-span-2">
                                                    <span className="font-semibold text-gray-800">Admin Note:</span> {booking.adminReason}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap md:flex-col justify-end gap-2 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gray-100 md:pl-4 w-full md:w-auto">
                                        {userRole === 'ADMIN' && booking.status === 'PENDING' && (
                                            <>
                                                <button onClick={() => handleReview(booking.id, 'APPROVED')} className="w-full md:w-auto px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors">Approve</button>
                                                <button onClick={() => handleReview(booking.id, 'REJECTED')} className="w-full md:w-auto px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors">Reject</button>
                                            </>
                                        )}
                                        {booking.status !== 'CANCELLED' && booking.status !== 'REJECTED' && (
                                            <button onClick={() => handleCancel(booking.id)} className="w-full md:w-auto px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium transition-colors">Cancel</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            </div>
        </div>
    );
}
