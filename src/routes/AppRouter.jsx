import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../shared/context/AuthContext';


import Login from '../pages/Login';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import Unauthorized from '../pages/Unauthorized';


import RoleBasedRoute from './RoleBasedRoute';


import AdminDashboard from '../modules/admin/pages/Dashboard';
import DoctorDashboard from '../modules/doctor/pages/Dashboard';
import ReceptionistDashboard from '../modules/receptionist/pages/Dashboard';
import PharmacistDashboard from '../modules/pharmacist/pages/Dashboard';
import LabTechDashboard from '../modules/labTech/pages/Dashboard';

// ✅ ONLY ADDITION: Layout Import
import ReceptionistLayout from '../modules/receptionist/layout/ReceptionistLayout';


// Pharmacist Pages
import ViewAllMedicines from '../modules/pharmacist/pages/ViewAllMedicines';
import AddMedicine from '../modules/pharmacist/pages/AddMedicine';
import EditMedicine from '../modules/pharmacist/pages/EditMedicine';
import PendingPrescriptions from '../modules/pharmacist/pages/ViewPrescriptions';
import QuickSale from '../modules/pharmacist/pages/QuickSale';
import SalesHistory from '../modules/pharmacist/pages/SalesHistory';
import StockHistory from '../modules/pharmacist/pages/StockHistory';
import DispenseMedicine from '../modules/pharmacist/pages/DispenseMedicine';
import GenerateBill from '../modules/pharmacist/pages/GenerateBill';
import PrescriptionList from '../modules/pharmacist/pages/PrescriptionList';


// Receptionist Pages
import AddPatient from '../modules/receptionist/components/AddPatient';
import PatientSuccess from '../modules/receptionist/components/PatientSuccess';
import SearchPatient from '../modules/receptionist/components/SearchPatient';
import ViewPatient from '../modules/receptionist/components/ViewPatient';
import PatientDetail from '../modules/receptionist/components/PatientDetail';
import EditPatient from '../modules/receptionist/components/EditPatient';
import BookAppointment from '../modules/receptionist/components/BookAppointment';
import ViewAppointments from '../modules/receptionist/components/ViewAppointments';
import AppointmentDetail from '../modules/receptionist/components/AppointmentDetail';
import GenerateBillList from '../modules/receptionist/components/GenerateBillList';
import BillGeneration from '../modules/receptionist/components/BillGeneration';
import ViewBills from '../modules/receptionist/components/ViewBills';
import PaymentPage from '../modules/receptionist/components/PaymentPage';
import PaymentSuccess from '../modules/receptionist/components/PaymentSuccess';


import { ROLES } from '../shared/api/config';


const AppRouter = () => {
  const { isAuthenticated, loading } = useAuth();


  // Show loading while checking auth
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


  return (
  <Routes>
    {/* ========== PUBLIC ROUTES ========== */}
    <Route 
      path="/login" 
      element={<Login />} 
    />
    
    <Route path="/" element={
      isAuthenticated ? <Home /> : <Navigate to="/login" replace />
    } />
    <Route path="/unauthorized" element={<Unauthorized />} />


      {/* ========== ADMIN ROUTES ========== */}
      <Route 
        path="/admin" 
        element={
          <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminDashboard />
          </RoleBasedRoute>
        } 
      />


      {/* ========== DOCTOR ROUTES ========== */}
      <Route 
        path="/doctor" 
        element={
          <RoleBasedRoute allowedRoles={[ROLES.DOCTOR]}>
            <DoctorDashboard />
          </RoleBasedRoute>
        } 
      />


      {/* ========== RECEPTIONIST ROUTES ========== */}
      
      {/* ✅ WRAP ALL RECEPTIONIST ROUTES */}
      <Route 
        path="/receptionist" 
        element={
          <RoleBasedRoute allowedRoles={[ROLES.RECEPTIONIST]}>
            <ReceptionistLayout />
          </RoleBasedRoute>
        } 
      >
        {/* Dashboard */}
        <Route 
          index
          element={<ReceptionistDashboard />} 
        />


        {/* Patient Management */}
        <Route 
          path="add-patient" 
          element={<AddPatient />} 
        />
        <Route 
          path="patient-success" 
          element={<PatientSuccess />} 
        />
        <Route 
          path="search-patient" 
          element={<SearchPatient />} 
        />
        <Route 
          path="view-patients" 
          element={<ViewPatient />} 
        />
        <Route 
          path="patient/:patientId" 
          element={<PatientDetail />} 
        />
        <Route 
          path="edit-patient/:patientId" 
          element={<EditPatient />} 
        />


        {/* Appointment Management */}
        <Route 
          path="book-appointment" 
          element={<BookAppointment />} 
        />
        <Route 
          path="view-appointments" 
          element={<ViewAppointments />} 
        />
        <Route 
          path="appointment/:appointmentId" 
          element={<AppointmentDetail />} 
        />


        {/* Billing & Payments */}
        <Route 
          path="billing" 
          element={<GenerateBillList />} 
        />
        <Route 
          path="bill-generation" 
          element={<BillGeneration />} 
        />
        <Route 
          path="view-bills" 
          element={<ViewBills />} 
        />
        <Route 
          path="payment/:billId" 
          element={<PaymentPage />} 
        />
        <Route 
          path="payment-success" 
          element={<PaymentSuccess />} 
        />
      </Route>


      {/* ========== PHARMACIST ROUTES ========== */}
      
      {/* Dashboard */}
      <Route 
        path="/pharmacist" 
        element={
          <RoleBasedRoute allowedRoles={[ROLES.PHARMACIST]}>
            <PharmacistDashboard />
          </RoleBasedRoute>
        } 
      />
      <Route 
        path="/pharmacist/dashboard" 
        element={
          <RoleBasedRoute allowedRoles={[ROLES.PHARMACIST]}>
            <PharmacistDashboard />
          </RoleBasedRoute>
        } 
      />


      {/* Medicine Management */}
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


      {/* Prescriptions */}
      <Route 
        path="/pharmacist/prescriptions" 
        element={
          <RoleBasedRoute allowedRoles={[ROLES.PHARMACIST]}>
            <PendingPrescriptions />
          </RoleBasedRoute>
        } 
      />
      <Route 
        path="/pharmacist/prescription-list" 
        element={
          <RoleBasedRoute allowedRoles={[ROLES.PHARMACIST]}>
            <PrescriptionList />
          </RoleBasedRoute>
        } 
      />
      <Route 
        path="/pharmacist/dispense/:id" 
        element={
          <RoleBasedRoute allowedRoles={[ROLES.PHARMACIST]}>
            <DispenseMedicine />
          </RoleBasedRoute>
        } 
      />


      {/* Sales */}
      <Route 
        path="/pharmacist/quick-sale" 
        element={
          <RoleBasedRoute allowedRoles={[ROLES.PHARMACIST]}>
            <QuickSale />
          </RoleBasedRoute>
        } 
      />
      <Route 
        path="/pharmacist/sales-history" 
        element={
          <RoleBasedRoute allowedRoles={[ROLES.PHARMACIST]}>
            <SalesHistory />
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
      <Route 
        path="/pharmacist/generate-bill" 
        element={
          <RoleBasedRoute allowedRoles={[ROLES.PHARMACIST]}>
            <GenerateBill />
          </RoleBasedRoute>
        } 
      />


      {/* ========== LAB TECH ROUTES ========== */}
      <Route 
        path="/lab-tech" 
        element={
          <RoleBasedRoute allowedRoles={[ROLES.LAB_TECH]}>
            <LabTechDashboard />
          </RoleBasedRoute>
        } 
      />


      {/* ========== 404 ========== */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};


export default AppRouter;
