import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../shared/api/config';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/token/`, formData);
      const { access, refresh } = response.data;

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      const user = {
        username: formData.username,
        role: 'Pharmacist'
      };

      localStorage.setItem('user', JSON.stringify(user));

      const roleRoutes = {
        Admin: '/admin/dashboard',
        Doctor: '/doctor/dashboard',
        Receptionist: '/receptionist/dashboard',
        Pharmacist: '/pharmacist/dashboard',
      };

      navigate(roleRoutes[user.role] || '/unauthorized');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ width: '100%', maxWidth: '400px', margin: '20px' }}>
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
          
          <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '30px', textAlign: 'center' }}>
            <h2 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', margin: '0 0 5px 0' }}>Hospital CMS</h2>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', margin: 0 }}>Clinic Management System</p>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: '30px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }}
                placeholder="Enter username"
                autoComplete="username"
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }}
                placeholder="Enter password"
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <div style={{ background: '#fee', border: '2px solid #f66', borderRadius: '8px', padding: '12px', marginBottom: '20px', color: '#c33', fontSize: '14px' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#666' }}>
              Demo: pharmacist1 / pharm123
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
