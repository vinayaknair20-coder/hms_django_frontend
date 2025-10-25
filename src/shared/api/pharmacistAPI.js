import axiosInstance from '../utils/axiosInstance';

const API_BASE = '/api/pharmacist';
const DOCTOR_API_BASE = '/api/doctor';

export const pharmacistAPI = {
  // ==========================================
  // DASHBOARD STATS
  // ==========================================
  async getDashboardStats() {
    try {
      const response = await axiosInstance.get(`${API_BASE}/dashboard-stats/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // ==========================================
  // MEDICINES CRUD
  // ==========================================
  async getMedicines() {
    const response = await axiosInstance.get(`${API_BASE}/medicines/`);
    return response.data;
  },

  async getMedicine(id) {
    const response = await axiosInstance.get(`${API_BASE}/medicines/${id}/`);
    return response.data;
  },

  async addMedicine(medicineData) {
    const response = await axiosInstance.post(`${API_BASE}/medicines/`, medicineData);
    return response.data;
  },

  async updateMedicine(id, medicineData) {
    const response = await axiosInstance.put(`${API_BASE}/medicines/${id}/`, medicineData);
    return response.data;
  },

  async deleteMedicine(id) {
    const response = await axiosInstance.delete(`${API_BASE}/medicines/${id}/`);
    return response.data;
  },

  async searchMedicines(query) {
    const response = await axiosInstance.get(`${API_BASE}/medicines/?search=${query}`);
    return response.data;
  },

  // ==========================================
  // MEDICINES - LOW STOCK
  // ==========================================
  async getLowStock() {
    const response = await axiosInstance.get(`${API_BASE}/medicines/low-stock/`);
    return response.data;
  },

  // ==========================================
  // 🔥 QUICK SALE (WALK-IN)
  // ==========================================
  async searchMedicinesForQuickSale(query) {
    try {
      const response = await axiosInstance.get(`${API_BASE}/search-medicines/?q=${query}`);
      return response.data;
    } catch (error) {
      console.error('Error searching medicines:', error);
      throw error;
    }
  },

  async createQuickSale(saleData) {
    try {
      const response = await axiosInstance.post(`${API_BASE}/quick-sale/`, saleData);
      return response.data;
    } catch (error) {
      console.error('Error creating quick sale:', error);
      throw error;
    }
  },

  // ==========================================
  // 🔥 SALES HISTORY - NEW!
  // ==========================================
  async getSalesHistory(filters = {}) {
    try {
      let url = `${API_BASE}/sales-history/`;
      const params = new URLSearchParams(filters).toString();
      if (params) {
        url += `?${params}`;
      }
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales history:', error);
      throw error;
    }
  },

  // ==========================================
  // PRESCRIPTIONS
  // ==========================================
  async getPrescriptionMedicines() {
    const response = await axiosInstance.get(`${API_BASE}/prescriptionmedicines/`);
    return response.data;
  },

  async getPrescriptionMedicinesByPrescriptionId(prescriptionId) {
    const response = await axiosInstance.get(
      `${API_BASE}/prescriptionmedicines/?prescription=${prescriptionId}`
    );
    return response.data;
  },

  // ==========================================
  // PENDING PRESCRIPTIONS
  // ==========================================
  async getPendingPrescriptions() {
    try {
      const response = await axiosInstance.get(`${API_BASE}/medicinebilling/pending-prescriptions/`);
      console.log('✅ Fetched from /api/pharmacist/medicinebilling/pending-prescriptions/');
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching pending prescriptions:', error);
      throw error;
    }
  },

  async getPrescription(prescriptionId) {
    const response = await axiosInstance.get(`${DOCTOR_API_BASE}/prescriptions/${prescriptionId}/`);
    return response.data;
  },

  async getMedicinePrescriptionsByPrescriptionId(prescriptionId) {
    const response = await axiosInstance.get(
      `${DOCTOR_API_BASE}/medicineprescriptions/?prescription=${prescriptionId}`
    );
    return response.data;
  },

  // ==========================================
  // 🔥 DISPENSE PRESCRIPTION
  // ==========================================
  async dispensePrescription(prescription_id) {
    try {
      const response = await axiosInstance.post(
        `${API_BASE}/medicinebilling/dispense-prescription/`,
        { prescription_id }
      );
      console.log('✅ Prescription dispensed successfully!', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error dispensing prescription:', error);
      throw error;
    }
  },

  // ==========================================
  // STOCK HISTORY
  // ==========================================
  async getStockHistory() {
    const response = await axiosInstance.get(`${API_BASE}/medicinestockhistory/`);
    return response.data;
  },

  async addStockHistory(stockData) {
    const response = await axiosInstance.post(`${API_BASE}/medicinestockhistory/`, stockData);
    return response.data;
  },

  // ==========================================
  // BILLING
  // ==========================================
  async getBillings() {
    const response = await axiosInstance.get(`${API_BASE}/medicinebilling/`);
    return response.data;
  },

  async createBilling(billingData) {
    const response = await axiosInstance.post(`${API_BASE}/medicinebilling/`, billingData);
    return response.data;
  },

  async getBillingSummary() {
    const response = await axiosInstance.get(`${API_BASE}/medicinebilling/billing-summary/`);
    return response.data;
  },

  // ==========================================
  // PROFILE
  // ==========================================
  async getProfile() {
    const response = await axiosInstance.get(`${API_BASE}/me/`);
    return response.data;
  },
};

export const {
  getDashboardStats,
  getMedicines,
  getMedicine,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  getLowStock,
  searchMedicines,
  searchMedicinesForQuickSale,
  createQuickSale,
  getSalesHistory,  // ✅ NEW!
  getPrescriptionMedicines,
  getPrescriptionMedicinesByPrescriptionId,
  getPendingPrescriptions,
  getPrescription,
  getMedicinePrescriptionsByPrescriptionId,
  dispensePrescription,
  getStockHistory,
  addStockHistory,
  getBillings,
  createBilling,
  getBillingSummary,
  getProfile,
} = pharmacistAPI;

export default pharmacistAPI;
