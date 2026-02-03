import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  createUser: (userData) => api.post('/admin/users', userData),
  getUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  createStore: (storeData) => api.post('/admin/stores', storeData),
  getStores: (params) => api.get('/admin/stores', { params }),
};

export const userAPI = {
  getStores: (params) => api.get('/user/stores', { params }),
  submitRating: (ratingData) => api.post('/user/ratings', ratingData),
  updateRating: (id, ratingData) => api.put(`/user/ratings/${id}`, ratingData),
};

export const ownerAPI = {
  getDashboard: () => api.get('/owner/dashboard'),
  getRatings: (params) => api.get('/owner/ratings', { params }),
};

export default api;
