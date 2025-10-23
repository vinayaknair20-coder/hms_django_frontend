import React, { useState, useEffect } from 'react';
import { getPendingPrescriptions, dispensePrescription } from '../../../shared/api/pharmacistAPI';
import { 
  Package, 
  User, 
  Calendar, 
  Pill, 
  CheckCircle, 
  AlertCircle,
  Clock,
  FileText,
  Activity
} from 'lucide-react';

const PendingPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dispensingId, setDispensingId] = useState(null);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      console.log('Fetching prescriptions...');
      const data = await getPendingPrescriptions();
      console.log('API Response:', data);
      
      // Handle different response formats
      let prescriptionsArray = [];
      if (Array.isArray(data)) {
        prescriptionsArray = data;
      } else if (data.pending_prescriptions && Array.isArray(data.pending_prescriptions)) {
        prescriptionsArray = data.pending_prescriptions;
      } else if (data.prescriptions && Array.isArray(data.prescriptions)) {
        prescriptionsArray = data.prescriptions;
      } else if (data.results && Array.isArray(data.results)) {
        prescriptionsArray = data.results;
      }
      
      console.log('Processed prescriptions:', prescriptionsArray);
      setPrescriptions(prescriptionsArray);
      setError(null);
    } catch (err) {
      console.error('Error fetching prescriptions:', err);
      setError(err.message || 'Failed to load prescriptions');
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDispense = async (prescriptionId) => {
    if (!window.confirm('Are you sure you want to dispense this prescription?')) {
      return;
    }

    try {
      setDispensingId(prescriptionId);
      await dispensePrescription(prescriptionId);
      alert('✅ Prescription dispensed successfully!');
      fetchPrescriptions();
    } catch (err) {
      console.error('Error dispensing prescription:', err);
      alert(`❌ Error: ${err.response?.data?.error || err.message}`);
    } finally {
      setDispensingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 absolute top-0 left-0"></div>
          </div>
          <p className="mt-6 text-lg text-gray-700 font-medium">Loading prescriptions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-2xl mx-auto mt-20">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-red-500">
            <div className="flex items-start gap-4">
              <div className="bg-red-100 rounded-full p-3">
                <AlertCircle className="text-red-600" size={28} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Prescriptions</h3>
                <p className="text-gray-700 mb-4">{error}</p>
                <button
                  onClick={fetchPrescriptions}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!prescriptions || prescriptions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-4xl mx-auto mt-20">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Package className="text-blue-600" size={48} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Pending Prescriptions</h3>
            <p className="text-gray-600 text-lg mb-6">All prescriptions have been dispensed. Great job!</p>
            <button
              onClick={fetchPrescriptions}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Activity className="inline-block mr-2" size={20} />
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-b-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-3">
                <FileText className="text-white" size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Pending Prescriptions</h2>
                <p className="text-gray-600 mt-1">Review and dispense patient prescriptions</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 px-6 py-4 rounded-xl shadow-inner">
              <div className="text-3xl font-bold text-green-700">{prescriptions.length}</div>
              <div className="text-sm text-green-600 font-medium">Total Pending</div>
            </div>
          </div>
        </div>

        {/* Prescriptions Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {prescriptions.map((prescription) => (
            <div
              key={prescription.id || prescription.prescription_id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-1"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 rounded-lg p-2">
                      <User size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{prescription.patient_name || 'Unknown Patient'}</h3>
                      <p className="text-blue-100 text-sm">Prescription #{prescription.id || prescription.prescription_id}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                    <Calendar className="text-blue-600" size={20} />
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Date</div>
                      <div className="text-sm font-semibold text-gray-900">
                        {new Date(prescription.created_at || Date.now()).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                    <Pill className="text-purple-600" size={20} />
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Medicines</div>
                      <div className="text-sm font-semibold text-gray-900">
                        {prescription.prescription_medicines?.length || 0} Items
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medicines List */}
                {prescription.prescription_medicines && prescription.prescription_medicines.length > 0 && (
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <Pill className="text-blue-600" size={18} />
                      Prescribed Medicines
                    </h4>
                    <div className="space-y-2">
                      {prescription.prescription_medicines.map((med, index) => (
                        <div 
                          key={`med-${prescription.id}-${index}`}
                          className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm"
                        >
                          <span className="font-semibold text-gray-800">{med.medicine_name || 'N/A'}</span>
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                            Qty: {med.quantity || 0}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Total Price */}
                {prescription.total_price && (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-semibold">Total Amount</span>
                      <span className="text-3xl font-bold text-green-700">₹{prescription.total_price}</span>
                    </div>
                  </div>
                )}

                {/* Dispense Button */}
                <button
                  onClick={() => handleDispense(prescription.id || prescription.prescription_id)}
                  disabled={dispensingId === (prescription.id || prescription.prescription_id)}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-3 ${
                    dispensingId === (prescription.id || prescription.prescription_id)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                  }`}
                >
                  {dispensingId === (prescription.id || prescription.prescription_id) ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-3 border-gray-400 border-t-transparent"></div>
                      <span>Dispensing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={24} />
                      <span>Dispense Prescription</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PendingPrescriptions;
