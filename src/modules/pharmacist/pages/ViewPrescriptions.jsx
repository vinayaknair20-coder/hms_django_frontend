import React, { useState, useEffect, useRef } from 'react';
import { getPendingPrescriptions, dispensePrescription } from '../../../shared/api/pharmacistAPI';
import { useReactToPrint } from 'react-to-print';
import Loader from '../../../shared/components/common/Loader';
import Modal from '../../../shared/components/common/Modal';
import SearchBar from '../../../shared/components/common/SearchBar';
import BillReceipt from '../components/BillReceipt';
import './ViewPrescriptions.css';

const ViewPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [dispensing, setDispensing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // For bill receipt
  const [billData, setBillData] = useState(null);
  const [showBill, setShowBill] = useState(false);
  const billRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => billRef.current,
  });

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPrescriptions(prescriptions);
    } else {
      const filtered = prescriptions.filter(
        (prescription) =>
          prescription.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prescription.doctor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prescription.prescription_id?.toString().includes(searchTerm)
      );
      setFilteredPrescriptions(filtered);
    }
  }, [searchTerm, prescriptions]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPendingPrescriptions();
      
      console.log('🔍 API RESPONSE:', data);
      
      const prescriptionList = data.pending_prescriptions || [];
      
      if (prescriptionList.length > 0) {
        console.log('📋 FIRST PRESCRIPTION:', prescriptionList[0]);
        console.log('💊 MEDICINES IN FIRST:', prescriptionList[0].medicines);
      }
      
      setPrescriptions(prescriptionList);
      setFilteredPrescriptions(prescriptionList);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch prescriptions');
      console.error('❌ Error fetching prescriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (prescription) => {
    console.log('🔍 VIEWING PRESCRIPTION:', prescription);
    console.log('💊 MEDICINES:', prescription.medicines);
    
    setSelectedPrescription(prescription);
    setShowModal(true);
    setSuccessMessage('');
  };

  const handleDispense = async (prescription_id) => {
    if (!window.confirm('Are you sure you want to dispense this prescription? This will update the inventory and create a bill.')) {
      return;
    }

    try {
      setDispensing(true);
      setError(null);
      
      console.log('💊 Dispensing prescription:', prescription_id);
      
      const response = await dispensePrescription(prescription_id);
      
      console.log('✅ Dispense response:', response);
      console.log('📦 Setting bill data:', response);
      
      // 🔥 FIXED: Store bill data and show bill modal
      setBillData(response);
      setShowBill(true);
      setShowModal(false); // Close prescription modal
      
      // Refresh prescriptions list
      await fetchPrescriptions();
      
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to dispense prescription';
      setError(errorMessage);
      console.error('❌ Error dispensing:', err);
      alert(`Error: ${errorMessage}`);
    } finally {
      setDispensing(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPrescription(null);
    setSuccessMessage('');
    setError(null);
  };

  const closeBillModal = () => {
    setShowBill(false);
    setBillData(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <div className="view-prescriptions-container">
        <Loader />
      </div>
    );
  }

  return (
    <div className="view-prescriptions-container">
      <div className="prescriptions-header">
        <h1>Pending Prescriptions</h1>
        <p className="prescriptions-count">
          Total: <span className="count-badge">{filteredPrescriptions.length}</span> pending prescriptions
        </p>
      </div>

      <div className="prescriptions-actions">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by patient name, doctor, or prescription ID..."
        />
        <button onClick={fetchPrescriptions} className="btn-refresh" disabled={loading}>
          <span className="icon">🔄</span> Refresh
        </button>
      </div>

      {error && (
        <div className="error-message">
          <span className="icon">⚠️</span> {error}
        </div>
      )}

      {filteredPrescriptions.length === 0 ? (
        <div className="no-prescriptions">
          <div className="no-data-icon">📋</div>
          <h3>No Pending Prescriptions</h3>
          <p>All prescriptions have been processed or there are no prescriptions available.</p>
        </div>
      ) : (
        <div className="prescriptions-table-wrapper">
          <table className="prescriptions-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient Name</th>
                <th>Doctor Name</th>
                <th>Date</th>
                <th>Dosage</th>
                <th>Frequency</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrescriptions.map((prescription) => (
                <tr key={prescription.prescription_id}>
                  <td>
                    <span className="prescription-id">#{prescription.prescription_id}</span>
                  </td>
                  <td className="patient-name">{prescription.patient_name || 'N/A'}</td>
                  <td>{prescription.doctor_name || 'N/A'}</td>
                  <td>{formatDate(prescription.prescription_date)}</td>
                  <td>{prescription.dosage || 'N/A'}</td>
                  <td>{prescription.frequency || 'N/A'}</td>
                  <td>{prescription.duration || 'N/A'}</td>
                  <td>
                    <button
                      onClick={() => handleViewDetails(prescription)}
                      className="btn-view-details"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Prescription Details Modal */}
      {showModal && selectedPrescription && (
        <Modal onClose={closeModal} title="Prescription Details">
          <div className="prescription-modal-content">
            {successMessage && (
              <div className="success-message">
                {successMessage}
              </div>
            )}

            <div className="prescription-header-info">
              <div className="info-row">
                <label>Patient Name:</label>
                <span>{selectedPrescription.patient_name}</span>
              </div>
              <div className="info-row">
                <label>Doctor Name:</label>
                <span>{selectedPrescription.doctor_name}</span>
              </div>
              <div className="info-row">
                <label>Date:</label>
                <span>{formatDate(selectedPrescription.prescription_date)}</span>
              </div>
              <div className="info-row">
                <label>Dosage:</label>
                <span>{selectedPrescription.dosage || 'N/A'}</span>
              </div>
              <div className="info-row">
                <label>Frequency:</label>
                <span>{selectedPrescription.frequency || 'N/A'}</span>
              </div>
              <div className="info-row">
                <label>Duration:</label>
                <span>{selectedPrescription.duration || 'N/A'}</span>
              </div>
            </div>

            <div className="medicines-section">
              <h3>Prescribed Medicines</h3>
              
              {selectedPrescription.medicines && selectedPrescription.medicines.length > 0 ? (
                <div className="medicines-list">
                  {selectedPrescription.medicines.map((med, index) => (
                    <div key={med.id || index} className="medicine-card">
                      <h4>{med.medicinename}</h4>
                      <div className="medicine-details">
                        <p><strong>Quantity:</strong> {med.quantity}</p>
                        <p><strong>Frequency:</strong> {med.frequency}</p>
                        <p><strong>Duration:</strong> {med.duration}</p>
                        {med.timing && <p><strong>Timing:</strong> {med.timing}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-medicines">No medicines found for this prescription.</p>
              )}
            </div>

            <div className="modal-actions">
              <button 
                onClick={() => handleDispense(selectedPrescription.prescription_id)}
                className="btn-dispense"
                disabled={dispensing || !selectedPrescription.medicines || selectedPrescription.medicines.length === 0}
              >
                {dispensing ? '💊 Dispensing...' : '💊 Dispense Medicines'}
              </button>
              <button onClick={closeModal} className="btn-close" disabled={dispensing}>
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* 🔥 Bill Receipt Modal - FIXED PROP NAME */}
      {showBill && billData && (
        <Modal onClose={closeBillModal} title="Bill Receipt">
          <div className="bill-modal-content">
            <BillReceipt ref={billRef} bill={billData} />
            
            <div className="bill-actions">
              <button onClick={handlePrint} className="btn-print">
                🖨️ Print Bill
              </button>
              <button onClick={closeBillModal} className="btn-close">
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ViewPrescriptions;
