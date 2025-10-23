import { useState } from 'react';
import { useAuth } from '../shared/context/AuthContext';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔴 BUTTON CLICKED!');
    console.log('Username:', username);
    console.log('Password:', password);
    
    setError('');
    setLoading(true);

    try {
      await login({ username, password });
      // Navigation happens in AuthContext - no need to navigate here
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="hospital-logo">
          <span className="hospital-icon">🏥</span>
          <h1 className="hospital-name">Trinity Hospital</h1>
        </div>

        <div className="login-card">
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Sign in to continue</p>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                disabled={loading}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                disabled={loading}
                className="form-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="login-button"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="test-credentials">
            <p className="test-title">📋 Test Credentials:</p>
            <p className="test-item"><strong>Admin:</strong> admin / admin123</p>
            <p className="test-item"><strong>Doctor:</strong> doctor1 / doctor123</p>
            <p className="test-item"><strong>Pharmacist:</strong> pharmacist / pharmacist123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
