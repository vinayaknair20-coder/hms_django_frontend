import React from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../styles/theme';

const Unauthorized = () => {
  const navigate = useNavigate();

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
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '6rem', marginBottom: '1rem' }}>🚫</div>
        <h1 style={{
          fontSize: '4rem',
          fontWeight: 700,
          color: theme.colors.error.main,
          marginBottom: '1rem'
        }}>
          403
        </h1>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 600,
          color: theme.colors.text.primary,
          marginBottom: '1rem'
        }}>
          Access Denied
        </h2>
        <p style={{
          color: theme.colors.text.secondary,
          marginBottom: '2rem',
          lineHeight: 1.6
        }}>
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              backgroundColor: theme.colors.background.paper,
              color: theme.colors.text.primary,
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
              border: `1px solid ${theme.colors.border.main}`,
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            style={{
              backgroundColor: theme.colors.primary.main,
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
