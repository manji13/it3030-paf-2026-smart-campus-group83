import axiosClient from './axiosClient';

export const member1Api = {
  getResources: (params) => axiosClient.get('/member1/resources', { params }),
  getResourceById: (resourceId) => axiosClient.get(`/member1/resources/${resourceId}`),
  createResource: (payload) => axiosClient.post('/member1/resources', payload),
  updateResource: (resourceId, payload) => axiosClient.put(`/member1/resources/${resourceId}`, payload),
  deleteResource: (resourceId) => axiosClient.delete(`/member1/resources/${resourceId}`)
};
