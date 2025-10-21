import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../styles/theme';

const Login = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const roles = [
    { value: 'ADMIN', label: 'Administrator', icon: '👨‍💼', color: '#e74c3c' },
    { value: 'DOCTOR', label: 'Doctor', icon: '👨‍⚕️', color: '#3498db' },
    { value: 'RECEPTIONIST', label: 'Receptionist', icon: '👩‍💻', color: '#2ecc71' },
    { value: 'PHARMACIST', label: 'Pharmacist', icon: '💊', color: '#9b59b6' },
    { value: 'LABTECH', label: 'Lab Technician', icon: '🔬', color: '#f39c12' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: API call will go here
    console.log('Login:', { ...formData, role: selectedRole });
    alert(`Login as ${selectedRole}\nUsername: ${formData.username}`);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme.colors.background.page,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        backgroundColor: theme.colors.background.paper,
        borderRadius: '1rem',
        padding: '3rem',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        border: `1px solid ${theme.colors.border.main}`
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏥</div>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 600,
            color: theme.colors.text.primary,
            marginBottom: '0.5rem'
          }}>
            Staff Login
          </h1>
          <p style={{ color: theme.colors.text.secondary, fontSize: '0.95rem' }}>
            Select your role to continue
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.75rem',
              fontWeight: 500,
              color: theme.colors.text.primary
            }}>
              Select Role
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.75rem'
            }}>
              {roles.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setSelectedRole(role.value)}
                  style={{
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    border: selectedRole === role.value
                      ? `2px solid ${role.color}`
                      : `1px solid ${theme.colors.border.main}`,
                    backgroundColor: selectedRole === role.value
                      ? `${role.color}10`
                      : theme.colors.background.default,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ fontSize: '2rem' }}>{role.icon}</div>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: theme.colors.text.primary
                  }}>
                    {role.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Username Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 500,
              color: theme.colors.text.primary
            }}>
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Enter your username"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: `1px solid ${theme.colors.border.main}`,
                fontSize: '1rem',
                backgroundColor: theme.colors.background.default
              }}
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 500,
              color: theme.colors.text.primary
            }}>
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: `1px solid ${theme.colors.border.main}`,
                fontSize: '1rem',
                backgroundColor: theme.colors.background.default
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!selectedRole}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: 'none',
              backgroundColor: selectedRole
                ? theme.colors.primary.main
                : theme.colors.gray[400],
              color: 'white',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: selectedRole ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s'
            }}
          >
            Login
          </button>
        </form>

        {/* Back to Home */}
        <button
          onClick={() => navigate('/')}
          style={{
            width: '100%',
            marginTop: '1rem',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            border: `1px solid ${theme.colors.border.main}`,
            backgroundColor: 'transparent',
            color: theme.colors.text.secondary,
            fontSize: '0.95rem',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default Login;
