import axiosClient from './axiosClient';

export const member3Api = {
  createTicket: (payload) => axiosClient.post('/member3/tickets', payload),
  listTickets: (params) => axiosClient.get('/member3/tickets', { params }),
  getTicketById: (ticketId) => axiosClient.get(`/member3/tickets/${ticketId}`),
  assignTechnician: (ticketId, payload) => axiosClient.patch(`/member3/tickets/${ticketId}/assign`, payload),
  updateStatus: (ticketId, payload) => axiosClient.patch(`/member3/tickets/${ticketId}/status`, payload),
  addResolution: (ticketId, payload) => axiosClient.patch(`/member3/tickets/${ticketId}/resolution`, payload),
  addComment: (ticketId, payload) => axiosClient.post(`/member3/tickets/${ticketId}/comments`, payload),
  updateComment: (ticketId, commentId, payload) =>
    axiosClient.put(`/member3/tickets/${ticketId}/comments/${commentId}`, payload),
  deleteComment: (ticketId, commentId) =>
    axiosClient.delete(`/member3/tickets/${ticketId}/comments/${commentId}`)
};
