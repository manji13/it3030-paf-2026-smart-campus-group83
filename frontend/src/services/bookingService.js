import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/v1/member2/bookings';

const getAuthHeader = () => {
    const token = localStorage.getItem('sch_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const createBooking = (data) => {
    return axios.post(BASE_URL, data, { headers: getAuthHeader() });
};

const getMyBookings = () => {
    return axios.get(`${BASE_URL}/me`, { headers: getAuthHeader() });
};

const getAllBookings = () => {
    return axios.get(`${BASE_URL}/admin`, { headers: getAuthHeader() });
};

const reviewBooking = (id, data) => {
    return axios.patch(`${BASE_URL}/${id}/decision`, {
        status: data.status,
        rejectionReason: data.reason,
    }, { headers: getAuthHeader() });
};

const cancelBooking = (id) => {
    return axios.patch(`${BASE_URL}/${id}/cancel`, {}, { headers: getAuthHeader() });
};

const deleteBooking = (id) => {
    return axios.delete(`${BASE_URL}/${id}`, { headers: getAuthHeader() });
};

const bookingService = {
    createBooking,
    getMyBookings,
    getAllBookings,
    reviewBooking,
    cancelBooking,
    deleteBooking
};

export default bookingService;
