import api from './api';

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

export const studentAPI = {
  getAll: () => api.get('/students'),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students/enroll', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
};

export const attendanceAPI = {
  take: (data) => api.post('/attendance/take', data),
  getAll: (params) => api.get('/attendance', { params }),
  getDashboardStats: () => api.get('/attendance/dashboard-stats'),
  getAnalyticsStats: (params) => api.get('/attendance/analytics-stats', { params }),
  delete: (id) => api.delete(`/attendance/${id}`),
};

export const classAPI = {
  getAll: () => api.get('/classes'),
  create: (data) => api.post('/classes', data),
  update: (id, data) => api.put(`/classes/${id}`, data),
  delete: (id) => api.delete(`/classes/${id}`),
};

export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
};
