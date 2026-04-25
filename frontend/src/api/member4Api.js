import axiosClient from './axiosClient';

export const member4Api = {
  mockGoogleLogin: (payload) => axiosClient.post('/auth/mock-google-login', payload),
  getProfile: () => axiosClient.get('/auth/me'),
  getUsers: () => axiosClient.get('/users'),
  getUserById: (id) => axiosClient.get(`/users/${id}`),
  updateUserRole: (id, payload) => axiosClient.patch(`/users/${id}/role`, payload),
  updateUserStatus: (id, payload) => axiosClient.patch(`/users/${id}/status`, payload),
  getNotifications: () => axiosClient.get('/member4/notifications/me'),
  markNotificationRead: (id) => axiosClient.patch(`/member4/notifications/${id}/read`),
  markAllNotificationsRead: () => axiosClient.patch('/member4/notifications/me/read-all'),
  getUnreadCount: () => axiosClient.get('/member4/notifications/me/unread-count')
};
