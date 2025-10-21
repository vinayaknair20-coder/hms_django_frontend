import React from 'react';
import { theme } from '../../../styles/theme';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.background.page,
          padding: '2rem'
        }}>
          <div style={{
            maxWidth: '600px',
            width: '100%',
            backgroundColor: theme.colors.background.paper,
            borderRadius: '1rem',
            padding: '3rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            border: `1px solid ${theme.colors.border.main}`,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: 600,
              color: theme.colors.text.primary,
              marginBottom: '1rem'
            }}>
              Something Went Wrong
            </h1>
            <p style={{
              color: theme.colors.text.secondary,
              marginBottom: '2rem',
              lineHeight: 1.6
            }}>
              We're sorry for the inconvenience. An unexpected error occurred.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div style={{
                backgroundColor: '#fee',
                border: '1px solid #c00',
                borderRadius: '0.5rem',
                padding: '1rem',
                marginBottom: '2rem',
                textAlign: 'left',
                overflow: 'auto',
                maxHeight: '200px'
              }}>
                <h3 style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#c00',
                  marginBottom: '0.5rem'
                }}>
                  Error Details:
                </h3>
                <pre style={{
                  fontSize: '0.75rem',
                  color: '#600',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  margin: 0
                }}>
                  {this.state.error.toString()}
                </pre>
              </div>
            )}

            <button
              onClick={this.handleReset}
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
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;  // ⚠️ THIS IS THE CRITICAL LINE!
