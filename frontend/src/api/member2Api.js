import axiosClient from './axiosClient';

export const member2Api = {
  createBooking: (payload) => axiosClient.post('/member2/bookings', payload),
  getMyBookings: () => axiosClient.get('/member2/bookings/me'),
  getAdminBookings: (params) => axiosClient.get('/member2/bookings/admin', { params }),
  decideBooking: (bookingId, payload) => axiosClient.patch(`/member2/bookings/${bookingId}/decision`, payload),
  cancelBooking: (bookingId) => axiosClient.patch(`/member2/bookings/${bookingId}/cancel`)
};
