import axios from 'axios';

const API_URL = 'http://localhost:8080/api/facilities';

const getFacilities = (params) => {
    return axios.get(API_URL, { params });
};

const getFacilityById = (id) => {
    return axios.get(`${API_URL}/${id}`);
};

const createFacility = (data) => {
    return axios.post(API_URL, data);
};

const updateFacility = (id, data) => {
    return axios.put(`${API_URL}/${id}`, data);
};

const deleteFacility = (id) => {
    return axios.delete(`${API_URL}/${id}`);
};

const facilityService = {
    getFacilities,
    getFacilityById,
    createFacility,
    updateFacility,
    deleteFacility,
};

export default facilityService;
