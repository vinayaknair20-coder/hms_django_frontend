// src/shared/api/authAPI.js
import axios from 'axios';
import { config } from './config';

const api = axios.create({
  baseURL: config.apiUrl,
  timeout: config.timeout,
  headers: config.headers,
});

export const authAPI = {
  // Login - Fixed to match Django endpoint
  login: (credentials) => api.post('/api/token/', credentials),
  
  // Refresh token
  refreshToken: (refreshToken) => api.post('/api/token/refresh/', { refresh: refreshToken }),
  
  // Get current user info
  getCurrentUser: () => {
    const token = localStorage.getItem('access_token');
    return api.get('/api/admin/me/', {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  // Logout (clear local storage)
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('username');
    return Promise.resolve();
  },
};
