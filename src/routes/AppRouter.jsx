import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../shared/context/AuthContext';

// Pages
import Login from '../pages/Login';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import Unauthorized from '../pages/Unauthorized';

// Role-based route protection
import RoleBasedRoute from './RoleBasedRoute';

// Dashboards
import AdminDashboard from '../modules/admin/pages/Dashboard';
import DoctorDashboard from '../modules/doctor/pages/Dashboard';
import ReceptionistDashboard from '../modules/receptionist/pages/Dashboard';
import PharmacistDashboard from '../modules/pharmacist/pages/Dashboard';
import LabTechDashboard from '../modules/labTech/pages/Dashboard';

// Import roles from config
import { ROLES } from '../shared/api/config';

const AppRouter = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
      />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Admin Routes */}
      <Route 
        path="/admin/dashboard" 
        element={
          <RoleBasedRoute allowedRoles={['Admin']}>
            <AdminDashboard />
          </RoleBasedRoute>
        } 
      />

      {/* Doctor Routes */}
      <Route 
        path="/doctor/dashboard" 
        element={
          <RoleBasedRoute allowedRoles={['Doctor']}>
            <DoctorDashboard />
          </RoleBasedRoute>
        } 
      />

      {/* Receptionist Routes */}
      <Route 
        path="/receptionist/dashboard" 
        element={
          <RoleBasedRoute allowedRoles={['Receptionist']}>
            <ReceptionistDashboard />
          </RoleBasedRoute>
        } 
      />

      {/* Pharmacist Routes */}
      <Route 
        path="/pharmacist/dashboard" 
        element={
          <RoleBasedRoute allowedRoles={['Pharmacist']}>
            <PharmacistDashboard />
          </RoleBasedRoute>
        } 
      />

      {/* Lab Technician Routes - BOTH PATHS for backward compatibility */}
      <Route 
        path="/lab/dashboard" 
        element={
          <RoleBasedRoute allowedRoles={['Lab Technician']}>
            <LabTechDashboard />
          </RoleBasedRoute>
        } 
      />
      <Route 
        path="/labtech/dashboard" 
        element={
          <RoleBasedRoute allowedRoles={['Lab Technician']}>
            <LabTechDashboard />
          </RoleBasedRoute>
        } 
      />

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
