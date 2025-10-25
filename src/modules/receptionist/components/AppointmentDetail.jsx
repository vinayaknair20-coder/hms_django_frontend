import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Stethoscope, Phone, MapPin, FileText, CreditCard, AlertCircle } from 'lucide-react';
import { appointmentAPI, patientAPI, billingAPI } from '../../../shared/api/receptionistAPI';

const AppointmentDetail = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  
  const [appointment, setAppointment] = useState(null);
  const [patient, setPatient] = useState(null);
  const [bill, setBill] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointmentDetails();
  }, [appointmentId]);

  const fetchAppointmentDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch appointment details
      const appointmentData = await appointmentAPI.getAppointmentById(appointmentId);
      setAppointment(appointmentData);

      // Fetch patient details
      if (appointmentData.Patient) {
        const patientData = await patientAPI.getPatientById(appointmentData.Patient);
        setPatient(patientData);
      }

      // Fetch bill if exists
      try {
        const billsData = await billingAPI.getAllBills();
        const appointmentBill = billsData.find(b => b.Appointment === parseInt(appointmentId));
        if (appointmentBill) {
          setBill(appointmentBill);
        }
      } catch (billError) {
        console.log('No bill found for this appointment');
      }

    } catch (err) {
      console.error('❌ Error fetching appointment details:', err);
      setError('Failed to load appointment details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateBill = () => {
    navigate('/receptionist/billing', {
      state: {
        appointmentId: appointment.id,
        patientId: appointment.Patient,
        patientName: appointment.patient_name
      }
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'checked-in':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading appointment details...</p>
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Appointment</h2>
            <p className="text-red-600 mb-4">{error || 'Appointment not found'}</p>
            <button
              onClick={() => navigate('/receptionist/view-appointments')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Back to Appointments
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/receptionist/view-appointments')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Appointments</span>
        </button>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Appointment Details</h1>
              <p className="text-gray-600 mt-1">Appointment ID: APT-{String(appointment.id).padStart(4, '0')}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(appointment.status)}`}>
              {appointment.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Appointment Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Appointment Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Date</label>
                  <p className="text-gray-900 font-medium">{formatDate(appointment.Appointment_date)}</p>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-gray-600">Time</label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-900 font-medium">{appointment.Appointment_time || 'Not specified'}</p>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-600">Reason</label>
                  <p className="text-gray-900">{appointment.reason || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Patient Information */}
            {patient && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-green-600" />
                  Patient Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Name</label>
                    <p className="text-gray-900 font-medium">{patient.Patient_name}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Gender</label>
                    <p className="text-gray-900">{patient.gender}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Phone</label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">{patient.phone}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Blood Group</label>
                    <p className="text-gray-900">{patient.blood_group || 'Not specified'}</p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-600">Address</label>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                      <p className="text-gray-900">{patient.address || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Doctor Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-purple-600" />
                Doctor Information
              </h2>
              
              <div>
                <label className="text-sm font-semibold text-gray-600">Assigned Doctor</label>
                <p className="text-gray-900 font-medium">Dr. {appointment.doctor_name || 'Not assigned'}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Billing Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-600" />
                Billing Status
              </h2>
              
              {bill ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Bill Amount</label>
                    <p className="text-2xl font-bold text-gray-900">₹{parseFloat(bill.Amount || 0).toFixed(2)}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Payment Status</label>
                    <p className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      bill.payment_status === 'Paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {bill.payment_status}
                    </p>
                  </div>
                  
                  {bill.Token && (
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Token</label>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-gray-400" />
                        <p className="text-gray-900 font-mono">{bill.Token}</p>
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={() => navigate('/receptionist/payment-success', { state: { billId: bill.id } })}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    View Receipt
                  </button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-4">No bill generated yet</p>
                  {appointment.status?.toLowerCase() === 'completed' && (
                    <button
                      onClick={handleGenerateBill}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                    >
                      Generate Bill
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              
              <div className="space-y-2">
                <button
                  onClick={() => navigate(`/receptionist/patient/${appointment.Patient}`)}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  View Patient Profile
                </button>
                
                <button
                  onClick={() => navigate('/receptionist/view-appointments')}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
                >
                  Back to All Appointments
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetail;
