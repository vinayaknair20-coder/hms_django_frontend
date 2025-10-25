import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, DollarSign, FileText, User, Calendar, CreditCard, AlertCircle } from 'lucide-react';
import { billingAPI, appointmentAPI, patientAPI } from '../../../shared/api/receptionistAPI';

const BillGeneration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // ✅ FIXED: Changed payment_status to lowercase 'pending'
  const [billData, setBillData] = useState({
    registration_fee: 100,
    consultation_fee: 500,
    payment_status: 'pending'  // ✅ Changed from 'Pending' to 'pending'
  });

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ FIXED: Handle appointmentData from navigation
  useEffect(() => {
    if (location.state?.appointmentData && appointments.length > 0) {
      console.log('📦 Received appointment data from navigation:', location.state.appointmentData);
      
      const appointmentId = location.state.appointmentData.id;
      const appointment = appointments.find(apt => apt.id === appointmentId);
      
      if (appointment) {
        console.log('✅ Found appointment in list:', appointment);
        setSelectedAppointment(appointment);
        handleAppointmentSelect(appointment);
      } else {
        console.log('⚠️ Appointment not in filtered list, adding it manually');
        // If the newly created appointment isn't in the list (because it's not completed yet),
        // add it manually
        const newAppointment = location.state.appointmentData;
        setAppointments(prev => [newAppointment, ...prev]);
        setSelectedAppointment(newAppointment);
        handleAppointmentSelect(newAppointment);
      }
    }
  }, [location.state, appointments, patients]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [appointmentsData, patientsData] = await Promise.all([
        appointmentAPI.getAllAppointments(),
        patientAPI.getAllPatients()
      ]);
      
      // ✅ FIXED: Include 'scheduled' status appointments (newly created)
      // Filter only appointments without bills
      const billsData = await billingAPI.getAllBills();
      const appointmentsWithoutBills = appointmentsData.filter(apt => 
        (apt.status?.toLowerCase() === 'completed' || apt.status?.toLowerCase() === 'scheduled') &&
        !billsData.some(bill => bill.Appointment === apt.id)
      );
      
      console.log('📋 Appointments without bills:', appointmentsWithoutBills.length);
      
      setAppointments(appointmentsWithoutBills);
      setPatients(patientsData);
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      alert('Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ NEW: Separate function to handle appointment selection
  const handleAppointmentSelect = (appointment) => {
    const patient = patients.find(p => p.id === appointment.Patient);
    if (patient) {
      setSelectedPatient(patient);
      console.log('✅ Patient found:', patient);
    } else {
      console.warn('⚠️ Patient not found for appointment:', appointment);
    }
  };

  const handleAppointmentChange = (e) => {
    const appointmentId = parseInt(e.target.value);
    const appointment = appointments.find(apt => apt.id === appointmentId);
    
    if (appointment) {
      setSelectedAppointment(appointment);
      handleAppointmentSelect(appointment);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const calculateTotal = () => {
    return parseFloat(billData.registration_fee || 0) + parseFloat(billData.consultation_fee || 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedAppointment) {
      alert('Please select an appointment');
      return;
    }
    
    if (!selectedPatient) {
      alert('Patient information not found');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const billPayload = {
        Patient: selectedPatient.id,
        Appointment: selectedAppointment.id,
        registration_fee: parseFloat(billData.registration_fee),
        consultation_fee: parseFloat(billData.consultation_fee),
        Amount: calculateTotal(),
        payment_status: billData.payment_status
      };

      console.log('📤 Submitting bill:', billPayload);
      
      const response = await billingAPI.createBill(billPayload);
      
      console.log('✅ Bill created successfully:', response);
      alert('Bill generated successfully!');
      
      // Navigate to payment page
      navigate('/receptionist/payment/' + response.id);
      
    } catch (error) {
      console.error('❌ Error creating bill:', error);
      console.error('❌ Full error response:', error.response?.data); // ✅ ADDED: Better error logging
      
      // ✅ ADDED: Better error message formatting
      let errorMessage = 'Failed to generate bill: ';
      if (error.response?.data) {
        if (typeof error.response.data === 'object') {
          errorMessage += JSON.stringify(error.response.data, null, 2);
        } else {
          errorMessage += error.response.data;
        }
      } else {
        errorMessage += error.message;
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/receptionist/billing')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Billing</span>
        </button>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Generate Bill</h1>
              <p className="text-gray-600 mt-1">Create a new billing invoice for appointments</p>
            </div>
          </div>
        </div>

        {appointments.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-yellow-800 mb-2">No Appointments Available</h2>
            <p className="text-yellow-700 mb-4">
              There are no appointments without bills. Please complete an appointment first.
            </p>
            <button
              onClick={() => navigate('/receptionist/view-appointments')}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            >
              View Appointments
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Appointment Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Select Appointment
              </h2>
              
              <select
                value={selectedAppointment?.id || ''}
                onChange={handleAppointmentChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Select Appointment --</option>
                {appointments.map(apt => (
                  <option key={apt.id} value={apt.id}>
                    APT-{String(apt.id).padStart(4, '0')} - {apt.Patient_name || 'Unknown'} - {new Date(apt.Appointment_date).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Patient Information */}
            {selectedPatient && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-green-600" />
                  Patient Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Patient Name</label>
                    <p className="text-gray-900 font-medium">{selectedPatient.Patient_name}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Phone</label>
                    <p className="text-gray-900">{selectedPatient.phone}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Gender</label>
                    <p className="text-gray-900">{selectedPatient.gender}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Blood Group</label>
                    <p className="text-gray-900">{selectedPatient.blood_group || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Bill Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-purple-600" />
                Bill Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Registration Fee (₹)
                  </label>
                  <input
                    type="number"
                    name="registration_fee"
                    value={billData.registration_fee}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Consultation Fee (₹)
                  </label>
                  <input
                    type="number"
                    name="consultation_fee"
                    value={billData.consultation_fee}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">Total Amount</span>
                    <span className="text-3xl font-bold text-blue-600">₹{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-orange-600" />
                Payment Status
              </h2>
              
              <select
                name="payment_status"
                value={billData.payment_status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/receptionist/billing')}
                className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting || !selectedAppointment}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
              >
                {isSubmitting ? 'Generating...' : 'Generate Bill & Proceed to Payment'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BillGeneration;
