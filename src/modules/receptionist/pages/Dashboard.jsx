import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, FileText, DollarSign, UserPlus, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { appointmentAPI, patientAPI, billingAPI } from '../../../shared/api/receptionistAPI';
import ConfirmModal from '../../../shared/components/common/ConfirmModal';

const ReceptionistDashboard = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingCheckIns: 0,
    totalPatients: 0,
    pendingBills: 0,
    completedToday: 0,
    totalRevenue: 0
  });
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [checkingInId, setCheckingInId] = useState(null);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [appointmentsData, patientsData, billsData] = await Promise.all([
        appointmentAPI.getAllAppointments(),
        patientAPI.getAllPatients(),
        billingAPI.getAllBills()
      ]);

      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = appointmentsData.filter(apt => 
        apt.Appointment_date === today
      );

      const pendingCheckIns = todayAppointments.filter(apt => 
        apt.status?.toLowerCase() === 'scheduled' || apt.status?.toLowerCase() === 'pending'
      ).length;

      const completedToday = todayAppointments.filter(apt =>
        apt.status?.toLowerCase() === 'completed'
      ).length;

      const pendingBills = billsData.filter(bill => 
        bill.payment_status?.toLowerCase() === 'pending'
      ).length;

      const totalRevenue = billsData.reduce((sum, bill) => 
        sum + parseFloat(bill.Amount || 0), 0
      );

      setStats({
        todayAppointments: todayAppointments.length,
        pendingCheckIns,
        totalPatients: patientsData.length,
        pendingBills,
        completedToday,
        totalRevenue
      });

      setAppointments(todayAppointments.slice(0, 5));

    } catch (err) {
      console.error('❌ Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Show check-in confirmation modal
  const handleCheckInClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  // ✅ ENHANCED: Confirm check-in with detailed logging
  const confirmCheckIn = async () => {
    if (!selectedAppointment) return;

    try {
      setCheckingInId(selectedAppointment.id);
      setShowModal(false);

      // ✅ Build update data - NO Appointment_time
      const updateData = {
        Patient: selectedAppointment.Patient,
        doctor: selectedAppointment.doctor,
        Appointment_date: selectedAppointment.Appointment_date,
        status: 'checked-in'
      };

      // Only add reason if it exists
      if (selectedAppointment.reason) {
        updateData.reason = selectedAppointment.reason;
      }

      console.log('📤 ========== CHECK-IN REQUEST ==========');
      console.log('🆔 Appointment ID:', selectedAppointment.id);
      console.log('📋 Update Data:', JSON.stringify(updateData, null, 2));
      console.log('🔍 Data Types:');
      console.log('   - Patient ID:', updateData.Patient, '(type:', typeof updateData.Patient, ')');
      console.log('   - Doctor ID:', updateData.doctor, '(type:', typeof updateData.doctor, ')');
      console.log('   - Date:', updateData.Appointment_date, '(type:', typeof updateData.Appointment_date, ')');
      console.log('   - Status:', updateData.status, '(type:', typeof updateData.status, ')');
      console.log('========================================');

      await appointmentAPI.updateAppointment(selectedAppointment.id, updateData);
      
      alert(`✅ ${selectedAppointment.Patient_name} has been checked in successfully!`);
      
      await fetchDashboardData();
    } catch (err) {
      console.error('❌ ========== CHECK-IN FAILED ==========');
      console.error('Error Object:', err);
      console.error('Response Status:', err.response?.status);
      console.error('Response Headers:', err.response?.headers);
      console.error('Response Data (Raw):', err.response?.data);
      console.error('Response Data (JSON):', JSON.stringify(err.response?.data, null, 2));
      console.error('========================================');
      
      let errorMessage = 'Unknown error';
      if (err.response?.data) {
        if (typeof err.response.data === 'object') {
          // Pretty format the error object
          errorMessage = JSON.stringify(err.response.data, null, 2);
        } else {
          errorMessage = err.response.data;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      alert(`Failed to check-in patient:\n${errorMessage}`);
    } finally {
      setCheckingInId(null);
      setSelectedAppointment(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Custom Confirm Modal */}
      <ConfirmModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedAppointment(null);
        }}
        onConfirm={confirmCheckIn}
        title="Check-in Patient"
        message={selectedAppointment ? 
          `Patient: ${selectedAppointment.Patient_name}\nDoctor: ${selectedAppointment.doctor_name}\nTime: ${selectedAppointment.Appointment_time}\n\nProceed with check-in?`
          : ''
        }
        confirmText="Check-In"
        cancelText="Cancel"
        type="info"
      />

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome Back! 👋</h1>
        <p className="text-blue-100">Here's what's happening with your hospital today.</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-800">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="ml-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer" onClick={() => navigate('/receptionist/view-appointments')}>
          <div className="flex items-center justify-between mb-3">
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
          <p className="text-3xl font-bold text-blue-600">{stats.todayAppointments}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-3">
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
          <p className="text-sm font-medium text-gray-600">Pending Check-Ins</p>
          <p className="text-3xl font-bold text-orange-600">{stats.pendingCheckIns}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-sm font-medium text-gray-600">Completed Today</p>
          <p className="text-3xl font-bold text-green-600">{stats.completedToday}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer" onClick={() => navigate('/receptionist/view-patients')}>
          <div className="flex items-center justify-between mb-3">
            <Users className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-sm font-medium text-gray-600">Total Patients</p>
          <p className="text-3xl font-bold text-purple-600">{stats.totalPatients}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer" onClick={() => navigate('/receptionist/view-bills')}>
          <div className="flex items-center justify-between mb-3">
            <FileText className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-sm font-medium text-gray-600">Pending Bills</p>
          <p className="text-3xl font-bold text-red-600">{stats.pendingBills}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-3">
            <DollarSign className="h-8 w-8 text-teal-600" />
          </div>
          <p className="text-sm font-medium text-gray-600">Total Revenue</p>
          <p className="text-2xl font-bold text-teal-600">₹{stats.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => navigate('/receptionist/add-patient')}
            className="flex items-center justify-center gap-2 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition group"
          >
            <UserPlus className="h-5 w-5 text-blue-600 group-hover:scale-110 transition" />
            <span className="font-medium text-blue-600">Register Patient</span>
          </button>
          
          <button 
            onClick={() => navigate('/receptionist/book-appointment')}
            className="flex items-center justify-center gap-2 p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition group"
          >
            <Calendar className="h-5 w-5 text-green-600 group-hover:scale-110 transition" />
            <span className="font-medium text-green-600">Book Appointment</span>
          </button>
          
          <button 
            onClick={() => navigate('/receptionist/view-patients')}
            className="flex items-center justify-center gap-2 p-4 bg-indigo-50 border-2 border-indigo-200 rounded-lg hover:bg-indigo-100 transition group"
          >
            <Users className="h-5 w-5 text-indigo-600 group-hover:scale-110 transition" />
            <span className="font-medium text-indigo-600">View Patients</span>
          </button>
          
          <button 
            onClick={() => navigate('/receptionist/view-bills')}
            className="flex items-center justify-center gap-2 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg hover:bg-purple-100 transition group"
          >
            <FileText className="h-5 w-5 text-purple-600 group-hover:scale-110 transition" />
            <span className="font-medium text-purple-600">View Bills</span>
          </button>
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Today's Appointments</h2>
          <button
            onClick={() => navigate('/receptionist/view-appointments')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All →
          </button>
        </div>
        
        {appointments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="h-16 w-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium mb-1">No appointments scheduled for today</p>
            <p className="text-sm">Book a new appointment to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {apt.Appointment_time || '---'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {apt.Patient_name || 'Unknown Patient'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {apt.doctor_name || 'Dr. Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        apt.status?.toLowerCase() === 'checked-in'
                          ? 'bg-green-100 text-green-800'
                          : apt.status?.toLowerCase() === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : apt.status?.toLowerCase() === 'scheduled'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {apt.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {apt.status?.toLowerCase() === 'scheduled' ? (
                        <button 
                          onClick={() => handleCheckInClick(apt)}
                          disabled={checkingInId === apt.id}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {checkingInId === apt.id ? 'Checking In...' : 'Check-In'}
                        </button>
                      ) : apt.status?.toLowerCase() === 'checked-in' ? (
                        <button 
                          onClick={() => navigate(`/receptionist/appointment/${apt.id}`)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition"
                        >
                          View
                        </button>
                      ) : apt.status?.toLowerCase() === 'completed' ? (
                        <button 
                          onClick={() => navigate('/receptionist/billing')}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition"
                        >
                          Generate Bill
                        </button>
                      ) : (
                        <button 
                          onClick={() => navigate(`/receptionist/appointment/${apt.id}`)}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium transition"
                        >
                          View Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
