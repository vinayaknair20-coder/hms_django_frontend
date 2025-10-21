// src/shared/api/pharmacistAPI.js
import axios from 'axios';
import { config } from './config';

const api = axios.create({
  baseURL: config.apiUrl,
  timeout: config.timeout,
  headers: config.headers,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${config.apiUrl}/api/token/refresh/`, {
          refresh: refreshToken,
        });
        const { access } = response.data;
        localStorage.setItem('access_token', access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Use existing backend endpoints
const getMedicines = () => {
  return api.get('/api/pharmacist/medicines/');
};

const getPrescriptionMedicines = () => {
  return api.get('/api/pharmacist/prescriptionmedicines/');
};

const updateMedicineStock = (medicineId, data) => {
  return api.patch(`/api/pharmacist/medicines/${medicineId}/`, data);
};

export const pharmacistAPI = {
  getMedicines,
  getPrescriptionMedicines,
  updateMedicineStock,
};
