import { createContext, useState, useContext, useEffect } from 'react';
import authAPI from '../api/authAPI';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const userData = authAPI.getCurrentUser();
    if (userData) {
      setUser(userData);
      setIsAuthenticated(true);
    }
    setLoading(false);
  };

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authAPI.login(credentials);
      
      console.log('✅ Login response:', data);
      console.log('✅ User role:', data.user?.role);
      
      setUser(data.user);
      setIsAuthenticated(true);
      setLoading(false);

      // Redirect based on role (handle both lowercase and capitalized)
      const role = (data.user?.role || '').toLowerCase();
      console.log('🔀 Role (lowercase):', role);
      
      const roleRoutes = {
        'admin': '/admin',
        'doctor': '/doctor',
        'receptionist': '/receptionist',
        'pharmacist': '/pharmacist',
        'lab technician': '/lab-tech',
        'labtech': '/lab-tech',
      };

      const redirectPath = roleRoutes[role] || '/login'; // ✅ Changed from '/home' to '/login'
      console.log('🔀 Redirecting to:', redirectPath);
      
      // Use window.location for hard redirect
      setTimeout(() => {
        window.location.href = redirectPath;
      }, 100);
      
    } catch (err) {
      console.error('❌ Login error:', err);
      setError(err.message || 'Login failed');
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    console.log('🚪 Logout initiated');
    
    // Clear API storage first
    authAPI.logout();
    
    // Reset local state
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    
    // ✅ Force hard redirect to login (works for ALL roles)
    window.location.href = '/login';
  };

  const getUserName = () => {
    if (!user) return 'User';
    return user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : user.username || 'User';
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      error,
      login,
      logout,
      getUserName,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
