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

  // Check if user is already logged in on mount
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
      console.log('🔐 Username:', credentials?.username);
      console.log('🔐 Password:', credentials?.password ? 'Yes' : 'No');
      
      // ✅ PASS credentials object DIRECTLY to authAPI.login
      const data = await authAPI.login(credentials);
      
      console.log('✅ User logged in:', data.user);
      console.log('🎭 User role:', data.user?.role);
      
      setUser(data.user);
      setIsAuthenticated(true);
      
      const role = data.user?.role;
      
      // Define role routes
      const roleRoutes = {
        'Admin': '/admin/dashboard',
        'Doctor': '/doctor/dashboard',
        'Receptionist': '/receptionist/dashboard',
        'Pharmacist': '/pharmacist/dashboard',
        'Lab Technician': '/lab/dashboard',
      };
      
      const redirectPath = roleRoutes[role] || '/unauthorized';
      console.log('🚀 Navigating to:', redirectPath);
      
      // Use setTimeout to ensure state is updated before navigation
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 100);
      
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

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
