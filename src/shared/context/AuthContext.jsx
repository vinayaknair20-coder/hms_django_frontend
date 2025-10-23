import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authAPI from '../api/authAPI';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const userData = authAPI.getCurrentUser();
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔐 AuthContext login called with:', credentials);
      console.log('🔐 Username:', credentials.username);
      console.log('🔐 Password:', credentials.password ? 'Yes' : 'No');

      const data = await authAPI.login(credentials);
      
      console.log('✅ User logged in:', data.user);
      console.log('🎭 User role:', data.user?.role);

      setUser(data.user);
      setIsAuthenticated(true);

      // Map roles to routes (MATCHING YOUR APPROUTER!)
      const roleRoutes = {
        'Admin': '/admin',
        'Doctor': '/doctor',
        'Receptionist': '/receptionist',
        'Pharmacist': '/pharmacist',
        'Lab Technician': '/lab-tech',
      };

      const redirectPath = roleRoutes[data.user?.role] || '/';
      console.log('🚀 Navigating to:', redirectPath);
      
      // Use window.location for guaranteed redirect
      window.location.href = redirectPath;
      
    } catch (err) {
      console.error('❌ Login error in AuthContext:', err);
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  const getUserName = () => {
    if (!user) return 'User';
    return user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : user.username || 'User';
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    getUserName,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
