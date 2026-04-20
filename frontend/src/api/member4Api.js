import axiosClient from './axiosClient';

export const member4Api = {
  mockGoogleLogin: (payload) => axiosClient.post('/auth/google/mock', payload),
  getProfile: () => axiosClient.get('/auth/me'),
  getNotifications: () => axiosClient.get('/member4/notifications/me'),
  markNotificationRead: (id) => axiosClient.patch(`/member4/notifications/${id}/read`),
  markAllNotificationsRead: () => axiosClient.patch('/member4/notifications/me/read-all'),
  getUnreadCount: () => axiosClient.get('/member4/notifications/me/unread-count')
};
