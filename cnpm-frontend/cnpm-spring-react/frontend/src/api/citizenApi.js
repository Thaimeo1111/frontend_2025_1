import axiosInstance from './axiosConfig';

const citizenApi = {
  // Existing CRUD endpoints
  getAll: (params) => axiosInstance.get('/nhan-khau', { params }),
  getById: (id) => axiosInstance.get(`/nhan-khau/${id}`),
  create: (data) => axiosInstance.post('/nhan-khau', data),
  update: (id, data) => axiosInstance.put(`/nhan-khau/${id}`, data),
  delete: (id) => axiosInstance.delete(`/nhan-khau/${id}`),

  // New endpoints for search and statistics
  search: (params) => axiosInstance.get('/nhan-khau/search', { params }),
  getStats: () => axiosInstance.get('/nhan-khau/stats'),
  getGenderStats: () => axiosInstance.get('/nhan-khau/stats/gender'),
  getAgeStats: () => axiosInstance.get('/nhan-khau/stats/age')
};

export default citizenApi;