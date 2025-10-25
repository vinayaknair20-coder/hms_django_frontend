import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/receptionist';

// Get auth token from localStorage
const getAuthToken = () => {
  const token = localStorage.getItem('access_token');
  console.log('🔑 Token retrieved:', token ? `${token.substring(0, 20)}...` : 'NULL');
  return token;
};

// Axios instance with auth header
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Authorization header added:', config.headers.Authorization.substring(0, 30) + '...');
    } else {
      console.error('❌ NO TOKEN FOUND IN LOCALSTORAGE!');
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ========== PATIENT APIs ==========
export const patientAPI = {
  getAll: async () => {
    console.log('📞 Calling patientAPI.getAll()');
    const response = await api.get('/patients/');
    return response;
  },
  getAllPatients: async () => {
    const response = await api.get('/patients/');
    return response.data;
  },
  create: async (patientData) => {
    console.log('📞 Calling patientAPI.create() with data:', patientData);
    const response = await api.post('/patients/', patientData);
    return response;
  },
  registerPatient: async (patientData) => {
    const response = await api.post('/patients/', patientData);
    return response.data;
  },
  getById: async (patientId) => {
    const response = await api.get(`/patients/${patientId}/`);
    return response;
  },
  getPatientById: async (patientId) => {
    const response = await api.get(`/patients/${patientId}/`);
    return response.data;
  },
  update: async (patientId, patientData) => {
    const response = await api.put(`/patients/${patientId}/`, patientData);
    return response;
  },
  updatePatient: async (patientId, patientData) => {
    const response = await api.put(`/patients/${patientId}/`, patientData);
    return response.data;
  },
  patchPatient: async (patientId, patientData) => {
    const response = await api.patch(`/patients/${patientId}/`, patientData);
    return response.data;
  },
  searchByPhone: async (phone) => {
    const response = await api.get(`/patients/search_by_phone/?phone=${phone}`);
    return response.data;
  },
  search: async (query) => {
    const response = await api.get(`/patients/?search=${query}`);
    return response;
  },
  delete: async (patientId) => {
    const response = await api.delete(`/patients/${patientId}/`);
    return response;
  },
  deletePatient: async (patientId) => {
    const response = await api.delete(`/patients/${patientId}/`);
    return response.data;
  },
};

// ========== APPOINTMENT APIs ==========
export const appointmentAPI = {
  getAll: async () => {
    console.log('📞 Calling appointmentAPI.getAll()');
    const response = await api.get('/appointments/');
    return response;
  },
  getAllAppointments: async () => {
    const response = await api.get('/appointments/');
    return response.data;
  },
  create: async (appointmentData) => {
    const response = await api.post('/appointments/', appointmentData);
    return response;
  },
  // ✅ ADDED: This is what BookAppointment.jsx is calling
  createAppointment: async (appointmentData) => {
    console.log('📞 Calling appointmentAPI.createAppointment() with data:', appointmentData);
    const response = await api.post('/appointments/', appointmentData);
    return response.data;
  },
  bookAppointment: async (appointmentData) => {
    const response = await api.post('/appointments/', appointmentData);
    return response.data;
  },
  getById: async (appointmentId) => {
    const response = await api.get(`/appointments/${appointmentId}/`);
    return response;
  },
  getAppointmentById: async (appointmentId) => {
    const response = await api.get(`/appointments/${appointmentId}/`);
    return response.data;
  },
  update: async (appointmentId, appointmentData) => {
    const response = await api.patch(`/appointments/${appointmentId}/`, appointmentData);
    return response.data;
  },
  updateAppointment: async (appointmentId, appointmentData) => {
    const response = await api.put(`/appointments/${appointmentId}/`, appointmentData);
    return response.data;
  },
  patchAppointment: async (appointmentId, appointmentData) => {
    const response = await api.patch(`/appointments/${appointmentId}/`, appointmentData);
    return response.data;
  },
  getTodaysAppointments: async () => {
    const response = await api.get('/appointments/today/');
    return response.data;
  },
  getUpcomingAppointments: async () => {
    const response = await api.get('/appointments/upcoming/');
    return response.data;
  },
  cancelAppointment: async (appointmentId) => {
    const response = await api.post(`/appointments/${appointmentId}/cancel/`);
    return response.data;
  },
  getDashboardStats: async () => {
    const response = await api.get('/appointments/dashboard_stats/');
    return response.data;
  },
  delete: async (appointmentId) => {
    const response = await api.delete(`/appointments/${appointmentId}/`);
    return response;
  },
  deleteAppointment: async (appointmentId) => {
    const response = await api.delete(`/appointments/${appointmentId}/`);
    return response.data;
  },
};

// ========== BILLING APIs ==========
export const billingAPI = {
  getAll: async () => {
    console.log('📞 Calling billingAPI.getAll()');
    const response = await api.get('/billings/');
    return response;
  },
  getAllBills: async () => {
    const response = await api.get('/billings/');
    return response.data;
  },
  create: async (billData) => {
    const response = await api.post('/billings/', billData);
    return response;
  },
  createBill: async (billData) => {
    const response = await api.post('/billings/', billData);
    return response.data;
  },
  getById: async (billId) => {
    const response = await api.get(`/billings/${billId}/`);
    return response;
  },
  getBillById: async (billId) => {
    const response = await api.get(`/billings/${billId}/`);
    return response.data;
  },
  update: async (billId, billData) => {
    const response = await api.put(`/billings/${billId}/`, billData);
    return response;
  },
  updateBill: async (billId, billData) => {
    const response = await api.put(`/billings/${billId}/`, billData);
    return response.data;
  },
  patchBill: async (billId, billData) => {
    const response = await api.patch(`/billings/${billId}/`, billData);
    return response.data;
  },
  getTodaysBills: async () => {
    const response = await api.get('/billings/today/');
    return response.data;
  },
  markBillAsPaid: async (billId, paymentData) => {
    const response = await api.post(`/billings/${billId}/mark_paid/`, paymentData);
    return response.data;
  },
  delete: async (billId) => {
    const response = await api.delete(`/billings/${billId}/`);
    return response;
  },
  deleteBill: async (billId) => {
    const response = await api.delete(`/billings/${billId}/`);
    return response.data;
  },
};

// ========== DOCTOR APIs ==========
export const doctorAPI = {
  getAll: async () => {
    console.log('📞 Calling doctorAPI.getAll()');
    const response = await api.get('/doctors/');
    return response;
  },
  getAllDoctors: async () => {
    console.log('📞 Calling doctorAPI.getAllDoctors()');
    const response = await api.get('/doctors/');
    return response.data;
  },
  getById: async (doctorId) => {
    const response = await api.get(`/doctors/${doctorId}/`);
    return response;
  },
  getDoctorById: async (doctorId) => {
    const response = await api.get(`/doctors/${doctorId}/`);
    return response.data;
  },
  getAllSpecializations: async () => {
    console.log('📞 Calling doctorAPI.getAllSpecializations()');
    const response = await api.get('/specializations/');
    return response.data;
  },
};

// Export default api instance
export default api;
