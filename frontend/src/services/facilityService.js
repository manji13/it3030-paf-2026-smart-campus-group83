import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/member1/resources';

const getAuthHeader = () => {
    const token = localStorage.getItem('sch_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const getFacilities = (params) => {
    return axios.get(API_URL, { params, headers: getAuthHeader() });
};

const getFacilityById = (id) => {
    return axios.get(`${API_URL}/${id}`, { headers: getAuthHeader() });
};

const createFacility = (data) => {
    return axios.post(API_URL, data, { headers: getAuthHeader() });
};

const updateFacility = (id, data) => {
    return axios.put(`${API_URL}/${id}`, data, { headers: getAuthHeader() });
};

const deleteFacility = (id) => {
    return axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
};

const facilityService = {
    getFacilities,
    getFacilityById,
    createFacility,
    updateFacility,
    deleteFacility,
};

export default facilityService;
