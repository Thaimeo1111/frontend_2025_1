import axiosInstance from './axiosConfig';

const authApi = {
  login: (payload) => axiosInstance.post('/auth/login', payload),
  logout: () => axiosInstance.post('/auth/logout')
};

export default authApi;