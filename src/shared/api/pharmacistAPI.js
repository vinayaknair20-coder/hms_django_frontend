// src/shared/api/pharmacistAPI.js
import axiosInstance from '../utils/axiosInstance';

const API_BASE = '/api/pharmacist';

export const pharmacistAPI = {
  // ==================== DASHBOARD ====================
  async getDashboardStats() {
    try {
      const [medicines, prescriptions, stockHistory, billing] = await Promise.all([
        axiosInstance.get(`${API_BASE}/medicines/`),
        axiosInstance.get(`${API_BASE}/prescriptionmedicines/`),
        axiosInstance.get(`${API_BASE}/medicinestockhistory/`),
        axiosInstance.get(`${API_BASE}/medicinebilling/`)
      ]);

      const lowStock = medicines.data.filter(med => med.stock < 20).length;
      const pending = prescriptions.data.filter(p => !p.dispensed).length;
      
      return {
        pendingPrescriptions: pending,
        lowStockItems: lowStock,
        todayDispensed: billing.data.length,
        totalInventory: medicines.data.length
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // ==================== MEDICINES ====================
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

  async getLowStock() {
    const response = await axiosInstance.get(`${API_BASE}/medicines/`);
    return response.data.filter(med => med.stock < 20);
  },

  async searchMedicines(query) {
    const response = await axiosInstance.get(`${API_BASE}/medicines/?search=${query}`);
    return response.data;
  },

  // ==================== PRESCRIPTIONS ====================
  async getPrescriptionMedicines() {
    const response = await axiosInstance.get(`${API_BASE}/prescriptionmedicines/`);
    return response.data;
  },

  async getPendingPrescriptions() {
    const response = await axiosInstance.get(`${API_BASE}/prescriptionmedicines/`);
    return response.data.filter(p => !p.dispensed);
  },

  async dispensePrescription(prescriptionId, data) {
    const response = await axiosInstance.post(
      `${API_BASE}/prescriptionmedicines/${prescriptionId}/dispense/`, 
      data
    );
    return response.data;
  },

  // ==================== STOCK HISTORY ====================
  async getStockHistory() {
    const response = await axiosInstance.get(`${API_BASE}/medicinestockhistory/`);
    return response.data;
  },

  async addStockHistory(stockData) {
    const response = await axiosInstance.post(`${API_BASE}/medicinestockhistory/`, stockData);
    return response.data;
  },

  // ==================== BILLING ====================
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

  // ==================== QUICK SALE ====================
  async quickSale(saleData) {
    const response = await axiosInstance.post(`${API_BASE}/medicines/quick-sale/`, saleData);
    return response.data;
  },

  // ==================== PROFILE ====================
  async getProfile() {
    const response = await axiosInstance.get(`${API_BASE}/me/`);
    return response.data;
  }
};

// Export individual functions for named imports
export const {
  getDashboardStats,
  getMedicines,
  getMedicine,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  getLowStock,
  searchMedicines,
  getPrescriptionMedicines,
  getPendingPrescriptions,
  dispensePrescription,
  getStockHistory,
  addStockHistory,
  getBillings,
  createBilling,
  getBillingSummary,
  quickSale,
  getProfile
} = pharmacistAPI;

export default pharmacistAPI;
