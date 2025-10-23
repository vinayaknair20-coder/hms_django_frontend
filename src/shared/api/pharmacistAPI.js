// src/shared/api/pharmacistAPI.js
import axiosInstance from '../utils/axiosInstance';

// ========================
// MEDICINE ENDPOINTS
// ========================

// Get all medicines
export const getAllMedicines = async () => {
  const response = await axiosInstance.get('/pharmacist/medicines/');
  return response.data;
};

// Get single medicine
export const getMedicine = async (id) => {
  const response = await axiosInstance.get(`/pharmacist/medicines/${id}/`);
  return response.data;
};

// Add new medicine
export const addMedicine = async (data) => {
  const response = await axiosInstance.post('/pharmacist/medicines/', data);
  return response.data;
};

// Update medicine
export const updateMedicine = async (id, data) => {
  const response = await axiosInstance.put(`/pharmacist/medicines/${id}/`, data);
  return response.data;
};

// Delete medicine
export const deleteMedicine = async (id) => {
  const response = await axiosInstance.delete(`/pharmacist/medicines/${id}/`);
  return response.data;
};

// Get low stock medicines
export const getLowStockMedicines = async () => {
  const response = await axiosInstance.get('/pharmacist/medicines/low-stock/');
  return response.data;
};

// ========================
// PRESCRIPTION ENDPOINTS
// ========================

// Get pending prescriptions
export const getPendingPrescriptions = async () => {
  const response = await axiosInstance.get('/pharmacist/medicinebilling/pending-prescriptions/');
  return response.data;
};

// Get all prescriptions (alias)
export const getAllPrescriptions = async () => {
  const response = await axiosInstance.get('/pharmacist/medicinebilling/pending-prescriptions/');
  return response.data;
};

// Dispense prescription
export const dispensePrescription = async (prescriptionId) => {
  const response = await axiosInstance.post(`/pharmacist/medicinebilling/${prescriptionId}/dispense/`);
  return response.data;
};

// ========================
// STOCK HISTORY ENDPOINTS
// ========================

// Get stock history
export const getStockHistory = async () => {
  const response = await axiosInstance.get('/pharmacist/medicinestockhistory/');
  return response.data;
};

// Add stock history entry
export const addStockHistory = async (data) => {
  const response = await axiosInstance.post('/pharmacist/medicinestockhistory/', data);
  return response.data;
};

// ========================
// MEDICINE BILLING ENDPOINTS
// ========================

// Get all billing records
export const getAllBillingRecords = async () => {
  const response = await axiosInstance.get('/pharmacist/medicinebilling/');
  return response.data;
};

// Get single billing record
export const getBillingRecord = async (id) => {
  const response = await axiosInstance.get(`/pharmacist/medicinebilling/${id}/`);
  return response.data;
};

// Create billing record
export const createBillingRecord = async (data) => {
  const response = await axiosInstance.post('/pharmacist/medicinebilling/', data);
  return response.data;
};

// Get billing summary
export const getBillingSummary = async () => {
  const response = await axiosInstance.get('/pharmacist/medicinebilling/billing-summary/');
  return response.data;
};

// ========================
// QUICK SALE ENDPOINT
// ========================

// Process quick sale
export const processQuickSale = async (saleData) => {
  const response = await axiosInstance.post('/pharmacist/medicines/quick-sale/', saleData);
  return response.data;
};

// ========================
// PRESCRIPTION MEDICINE ENDPOINTS
// ========================

// Get all prescription medicines
export const getAllPrescriptionMedicines = async () => {
  const response = await axiosInstance.get('/pharmacist/prescriptionmedicines/');
  return response.data;
};

// Get single prescription medicine
export const getPrescriptionMedicine = async (id) => {
  const response = await axiosInstance.get(`/pharmacist/prescriptionmedicines/${id}/`);
  return response.data;
};

// ========================
// PHARMACIST PROFILE
// ========================

// Get pharmacist profile
export const getPharmacistProfile = async () => {
  const response = await axiosInstance.get('/pharmacist/me/');
  return response.data;
};

export default {
  getAllMedicines,
  getMedicine,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  getLowStockMedicines,
  getPendingPrescriptions,
  getAllPrescriptions,
  dispensePrescription,
  getStockHistory,
  addStockHistory,
  getAllBillingRecords,
  getBillingRecord,
  createBillingRecord,
  getBillingSummary,
  processQuickSale,
  getAllPrescriptionMedicines,
  getPrescriptionMedicine,
  getPharmacistProfile,
};
