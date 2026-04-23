import axios from 'axios';

const API_URL = 'http://localhost:8080/api/bookings';

const getUserId = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.id : 'anonymous'; // Fallback if not logged in
};

const createBooking = (data) => {
    return axios.post(API_URL, data, {
        headers: { 'X-User-Id': getUserId() }
    });
};

const getMyBookings = () => {
    return axios.get(`${API_URL}/my-bookings`, {
        headers: { 'X-User-Id': getUserId() }
    });
};

const getAllBookings = () => {
    return axios.get(API_URL, {
        headers: { 'X-User-Id': getUserId() }
    });
};

const reviewBooking = (id, data) => {
    return axios.put(`${API_URL}/${id}/review`, data, {
        headers: { 'X-User-Id': getUserId() }
    });
};

const cancelBooking = (id) => {
    return axios.put(`${API_URL}/${id}/cancel`, {}, {
        headers: { 'X-User-Id': getUserId() }
    });
};

const bookingService = {
    createBooking,
    getMyBookings,
    getAllBookings,
    reviewBooking,
    cancelBooking
};

export default bookingService;
