import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../shared/context/AuthContext';

// Pages
import Login from '../pages/Login';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import Unauthorized from '../pages/Unauthorized';

// Role-based route protection
import RoleBasedRoute from './RoleBasedRoute';

// Dashboards - Import from modules
import AdminDashboard from '../modules/admin/pages/Dashboard';
import DoctorDashboard from '../modules/doctor/pages/Dashboard';
import ReceptionistDashboard from '../modules/receptionist/pages/Dashboard';
import PharmacistDashboard from '../modules/pharmacist/pages/Dashboard';
import LabTechDashboard from '../modules/labTech/pages/Dashboard';

// Pharmacist Module Pages
import ViewAllMedicines from '../modules/pharmacist/pages/ViewAllMedicines';
import AddMedicine from '../modules/pharmacist/pages/AddMedicine';
import EditMedicine from '../modules/pharmacist/pages/EditMedicine';
import PendingPrescriptions from '../modules/pharmacist/pages/PendingPrescriptions';
import QuickSale from '../modules/pharmacist/pages/QuickSale';
import StockHistory from '../modules/pharmacist/pages/StockHistory';

// Import roles from config
import { ROLES } from '../shared/api/config';

const AppRouter = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/" element={<Home />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminDashboard />
          </RoleBasedRoute>
        }
      />

      {/* Doctor Routes */}
      <Route
        path="/doctor"
        element={
          <RoleBasedRoute allowedRoles={[ROLES.DOCTOR]}>
            <DoctorDashboard />
          </RoleBasedRoute>
        }
      />

      {/* Receptionist Routes */}
      <Route
        path="/receptionist"
        element={
          <RoleBasedRoute allowedRoles={[ROLES.RECEPTIONIST]}>
            <ReceptionistDashboard />
          </RoleBasedRoute>
        }
      />

      {/* Pharmacist Routes */}
      <Route
        path="/pharmacist"
        element={
          <RoleBasedRoute allowedRoles={[ROLES.PHARMACIST]}>
            <PharmacistDashboard />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/pharmacist/medicines"
        element={
          <RoleBasedRoute allowedRoles={[ROLES.PHARMACIST]}>
            <ViewAllMedicines />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/pharmacist/add-medicine"
        element={
          <RoleBasedRoute allowedRoles={[ROLES.PHARMACIST]}>
            <AddMedicine />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/pharmacist/edit-medicine/:id"
        element={
          <RoleBasedRoute allowedRoles={[ROLES.PHARMACIST]}>
            <EditMedicine />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/pharmacist/prescriptions"
        element={
          <RoleBasedRoute allowedRoles={[ROLES.PHARMACIST]}>
            <PendingPrescriptions />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/pharmacist/quick-sale"
        element={
          <RoleBasedRoute allowedRoles={[ROLES.PHARMACIST]}>
            <QuickSale />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/pharmacist/stock-history"
        element={
          <RoleBasedRoute allowedRoles={[ROLES.PHARMACIST]}>
            <StockHistory />
          </RoleBasedRoute>
        }
      />

      {/* Lab Technician Routes */}
      <Route
        path="/lab-tech"
        element={
          <RoleBasedRoute allowedRoles={[ROLES.LAB_TECH]}>
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
