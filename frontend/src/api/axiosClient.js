import axios from 'axios';
import { API_BASE_URL } from '../app/constants';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('sch_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
