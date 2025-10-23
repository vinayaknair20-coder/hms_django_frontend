import { Navigate } from 'react-router-dom';
import { useAuth } from '../shared/context/AuthContext';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  console.log('🛡️ RoleBasedRoute Check:');
  console.log('  - Loading:', loading);
  console.log('  - isAuthenticated:', isAuthenticated);
  console.log('  - user:', user);
  console.log('  - user.role:', user?.role);
  console.log('  - allowedRoles:', allowedRoles);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    console.log('❌ Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check if user's role is in allowed roles
  if (!allowedRoles.includes(user.role)) {
    console.log('❌ Role not allowed, redirecting to unauthorized');
    return <Navigate to="/unauthorized" replace />;
  }

  console.log('✅ Access granted!');
  return children;
};

export default RoleBasedRoute;
