// src/shared/api/config.js

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

// Export both for flexibility
export { API_BASE_URL };

export const config = {
  apiUrl: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};
