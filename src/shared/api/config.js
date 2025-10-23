// Base API Configuration
export const API_BASE_URL = 'http://localhost:8000/api';  // Add 'export'

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${API_BASE_URL}/token/`,
  REFRESH_TOKEN: `${API_BASE_URL}/token/refresh/`,
  
  // Admin/Users
  USERS: `${API_BASE_URL}/users/`,
  STAFF: `${API_BASE_URL}/users/staff/`,
  DOCTORS: `${API_BASE_URL}/users/doctors/`,
  
  // Receptionist
  RECEPTIONIST: `${API_BASE_URL}/receptionist/`,
  PATIENTS: `${API_BASE_URL}/receptionist/patients/`,
  APPOINTMENTS: `${API_BASE_URL}/receptionist/appointments/`,
  BILLING: `${API_BASE_URL}/receptionist/billing/`,
  
  // Doctor
  DOCTOR: `${API_BASE_URL}/doctor/`,
  CONSULTATIONS: `${API_BASE_URL}/doctor/consultations/`,
  PRESCRIPTIONS: `${API_BASE_URL}/doctor/prescriptions/`,
  
  // Pharmacist
  PHARMACIST: `${API_BASE_URL}/pharmacist/`,
  MEDICINES: `${API_BASE_URL}/pharmacist/medicines/`,
  PRESCRIPTION_MEDICINES: `${API_BASE_URL}/pharmacist/prescriptionmedicines/`,
  MEDICINE_BILLING: `${API_BASE_URL}/pharmacist/medicinebilling/`,
  
  // Lab Technician
  LAB: `${API_BASE_URL}/lab_technician/`,
  LAB_TESTS: `${API_BASE_URL}/lab_technician/lab-tests/`,
  TEST_ORDERS: `${API_BASE_URL}/lab_technician/test-orders/`,
  TEST_RESULTS: `${API_BASE_URL}/lab_technician/test-results/`,
};

export const ROLES = {
  ADMIN: 'Admin',
  DOCTOR: 'Doctor',
  RECEPTIONIST: 'Receptionist',
  PHARMACIST: 'Pharmacist',
  LAB_TECH: 'Lab Technician',
};

export const ROLE_ROUTES = {
  [ROLES.ADMIN]: '/admin/dashboard',
  [ROLES.DOCTOR]: '/doctor/dashboard',
  [ROLES.RECEPTIONIST]: '/receptionist/dashboard',
  [ROLES.PHARMACIST]: '/pharmacist/dashboard',
  [ROLES.LAB_TECH]: '/lab/dashboard',
};

export default API_BASE_URL;
