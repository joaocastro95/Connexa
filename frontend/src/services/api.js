import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const groupsAPI = {
  create: (groupData) => api.post('/groups', groupData),
  search: (filters) => api.get('/groups/search', { params: filters }),
  join: (groupId) => api.post(`/groups/${groupId}/join`),
  getMembers: (groupId) => api.get(`/groups/${groupId}/members`),
};

export const notificationsAPI = {
  list: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
};

export const messagesAPI = {
  send: (groupId, message) => api.post(`/groups/${groupId}/messages`, { message }),
  list: (groupId, params) => api.get(`/groups/${groupId}/messages`, { params }),
};

export default api;