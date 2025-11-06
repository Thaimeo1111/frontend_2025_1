import axiosInstance from './axiosConfig';

const feeCollectionApi = {
  // Existing CRUD endpoints
  getAll: (params) => axiosInstance.get('/thu-phi', { params }),
  getById: (id) => axiosInstance.get(`/thu-phi/${id}`),
  create: (data) => axiosInstance.post('/thu-phi', data),
  update: (id, data) => axiosInstance.put(`/thu-phi/${id}`, data),
  delete: (id) => axiosInstance.delete(`/thu-phi/${id}`),

  // New endpoints for household-specific and statistics
  getByHousehold: (householdId) => axiosInstance.get(`/thu-phi/ho-khau/${householdId}`),
  getStats: () => axiosInstance.get('/thu-phi/stats'),
  getCollectionRate: () => axiosInstance.get('/thu-phi/stats/rate'),
  getCollectionByPeriod: (periodId) => axiosInstance.get(`/thu-phi/dot-thu/${periodId}`),
  getUnpaidHouseholds: () => axiosInstance.get('/thu-phi/chua-nop')
};

export default feeCollectionApi;