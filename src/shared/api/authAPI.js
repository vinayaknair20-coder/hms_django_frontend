// src/api/authAPI.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const authAPI = {
  // ========================
  // LOGIN
  // ========================
  login: async (credentials) => {
    try {
      console.log('🔐 Attempting login:', credentials.username);
      console.log('🔐 Password provided:', credentials.password ? 'Yes' : 'No');
      console.log('🔐 Password length:', credentials.password?.length);

      const response = await axios.post(`${API_BASE_URL}/auth/login/`, {
        username: credentials.username,
        password: credentials.password,
      });

      console.log('✅ Login successful:', response.data);

      // Save auth data to localStorage
      if (response.data && response.data.user && response.data.access_token) {
        const authData = {
          user: response.data.user,
          token: response.data.access_token,
          refresh_token: response.data.refresh_token,
        };

        localStorage.setItem('user', JSON.stringify(authData.user));
        localStorage.setItem('access_token', authData.token);
        localStorage.setItem('refresh_token', authData.refresh_token);

        console.log('✅ Auth data saved to localStorage');
        console.log('✅ User role:', authData.user.role);

        return authData; // ✅ RETURN authData with user, token, and refresh_token
      } else {
        throw new Error('Invalid response structure from server');
      }
    } catch (error) {
      console.error('❌ Login failed:', error);
      if (error.response) {
        console.error('❌ Server response:', error.response.data);
        throw new Error(error.response.data.error || 'Login failed');
      } else if (error.request) {
        throw new Error('No response from server. Please check if the backend is running.');
      } else {
        throw new Error(error.message || 'Login failed');
      }
    }
  },

  // ========================
  // LOGOUT
  // ========================
  logout: () => {
    console.log('🚪 Logging out...');
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    console.log('✅ Cleared localStorage');
  },

  // ========================
  // GET CURRENT USER
  // ========================
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');

    if (userStr && token) {
      try {
        const user = JSON.parse(userStr);
        console.log('👤 Current user from localStorage:', user);
        return user;
      } catch (error) {
        console.error('❌ Error parsing user data:', error);
        return null;
      }
    }
    return null;
  },

  // ========================
  // CHECK IF USER IS AUTHENTICATED
  // ========================
  isAuthenticated: () => {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // ========================
  // GET ACCESS TOKEN
  // ========================
  getToken: () => {
    return localStorage.getItem('access_token');
  },

  // ========================
  // REFRESH TOKEN (Optional - for future use)
  // ========================
  refreshToken: async () => {
    try {
      const refresh = localStorage.getItem('refresh_token');
      if (!refresh) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
        refresh: refresh,
      });

      if (response.data && response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        console.log('✅ Token refreshed successfully');
        return response.data.access;
      }
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      authAPI.logout();
      throw error;
    }
  },
};

export default authAPI;
