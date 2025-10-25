import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Eye, X, User, Stethoscope, Clock, Filter, Search, MoreVertical } from 'lucide-react';
import { appointmentAPI, billingAPI } from '../../../shared/api/receptionistAPI';

const ViewAppointments = () => {
  const navigate = useNavigate();
  
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [searchTerm, statusFilter, appointments]);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [appointmentsData, billsData] = await Promise.all([
        appointmentAPI.getAllAppointments(),
        billingAPI.getAllBills()
      ]);
      
      console.log('📋 Appointments data:', appointmentsData);
      
      setAppointments(appointmentsData);
      setBills(billsData);
      setFilteredAppointments(appointmentsData);
    } catch (err) {
      console.error('❌ Failed to fetch data:', err);
      setError('Failed to load appointments. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = [...appointments];

    if (statusFilter !== 'All') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(apt =>
        apt.Patient_name?.toLowerCase().includes(term) ||
        apt.doctor_name?.toLowerCase().includes(term) ||
        apt.id.toString().includes(term)
      );
    }

    setFilteredAppointments(filtered);
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        const appointment = appointments.find(apt => apt.id === appointmentId);
        
        if (!appointment) {
          alert('Appointment not found');
          return;
        }
        
        const updateData = {
          Patient: appointment.Patient,
          doctor: appointment.doctor,
          Appointment_date: appointment.Appointment_date,
          status: 'cancelled'
        };
        
        if (appointment.reason) {
          updateData.reason = appointment.reason;
        }
        
        await appointmentAPI.updateAppointment(appointmentId, updateData);
        
        alert('Appointment cancelled successfully!');
        setOpenDropdown(null);
        await fetchAppointments();
      } catch (error) {
        console.error('Error cancelling appointment:', error);
        alert(`Failed to cancel appointment: ${error.response?.data?.detail || error.message}`);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '---';
    if (timeString.includes(':')) {
      const parts = timeString.split(':');
      return `${parts[0]}:${parts[1]}`;
    }
    return timeString;
  };

  const getPaymentStatus = (appointmentId) => {
    const bill = bills.find(b => b.Appointment === appointmentId);
    
    if (bill && bill.Token) {
      return {
        isPaid: true,
        billId: bill.id,
        token: bill.Token,
        display: bill.Token,
        color: 'bg-green-100 text-green-800'
      };
    } else {
      return {
        isPaid: false,
        billId: null,
        token: null,
        display: 'Unpaid',
        color: 'bg-red-100 text-red-800'
      };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-full overflow-x-hidden">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">All Appointments</h1>
        <p className="text-gray-600 mt-1 text-sm md:text-base">View and manage patient appointments</p>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search patient or doctor..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none text-sm"
            >
              <option value="All">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="checked-in">Checked-In</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredAppointments.length} of {appointments.length} appointments
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-green-600">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-white uppercase">ID</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-white uppercase">Patient</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-white uppercase">Doctor</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-white uppercase hidden md:table-cell">Date</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-white uppercase hidden lg:table-cell">Time</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-white uppercase">Status</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-white uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {error ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-red-600">
                    {error}
                    <br />
                    <button
                      onClick={fetchAppointments}
                      className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Retry
                    </button>
                  </td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No appointments found
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appointment) => {
                  const paymentStatus = getPaymentStatus(appointment.id);
                  return (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className="px-2 py-1 bg-green-600 text-white rounded-full text-xs font-semibold">
                          {String(appointment.id).padStart(3, '0')}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.Patient_name || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500 md:hidden">
                          {formatDate(appointment.Appointment_date)}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.doctor_name || 'Dr. Unknown'}
                        </div>
                        <div className="text-xs text-gray-500 lg:hidden">
                          {formatTime(appointment.Appointment_time)}
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap hidden md:table-cell">
                        <span className="text-sm text-gray-600">
                          {formatDate(appointment.Appointment_date)}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap hidden lg:table-cell">
                        <span className="text-sm text-gray-600">
                          {formatTime(appointment.Appointment_time)}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          appointment.status?.toLowerCase() === 'checked-in'
                            ? 'bg-green-100 text-green-800'
                            : appointment.status?.toLowerCase() === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : appointment.status?.toLowerCase() === 'scheduled'
                            ? 'bg-yellow-100 text-yellow-800'
                            : appointment.status?.toLowerCase() === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {appointment.status || 'N/A'}
                        </span>
                        <div className="mt-1 md:hidden">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${paymentStatus.color}`}>
                            {paymentStatus.display}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() => setOpenDropdown(openDropdown === appointment.id ? null : appointment.id)}
                            className="p-2 hover:bg-green-50 rounded-lg transition text-green-600 hover:text-green-700"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </button>
                          
                          {openDropdown === appointment.id && (
                            <>
                              <div 
                                className="fixed inset-0 z-10" 
                                onClick={() => setOpenDropdown(null)}
                              />
                              <div className="absolute right-0 z-20 mt-2 w-48 rounded-lg shadow-xl bg-white border-2 border-green-200">
                                <div className="py-1">
                                  <button
                                    onClick={() => {
                                      if (paymentStatus.isPaid) {
                                        navigate('/receptionist/payment-success', { 
                                          state: { billId: paymentStatus.billId } 
                                        });
                                      } else {
                                        navigate(`/receptionist/appointment/${appointment.id}`);
                                      }
                                      setOpenDropdown(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50 flex items-center gap-2 transition"
                                  >
                                    <Eye className="h-4 w-4 text-green-600" />
                                    View Details
                                  </button>
                                  {appointment.status?.toLowerCase() !== 'cancelled' && (
                                    <button
                                      onClick={() => handleCancelAppointment(appointment.id)}
                                      className="w-full text-left px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 flex items-center gap-2 transition"
                                    >
                                      <X className="h-4 w-4 text-red-600" />
                                      Cancel Appointment
                                    </button>
                                  )}
                                  <div className="px-4 py-2 text-xs border-t border-gray-200 md:hidden">
                                    <div className="flex items-center justify-between">
                                      <span className="text-gray-600 font-medium">Payment:</span>
                                      <span className={`px-2 py-1 rounded-full font-semibold ${paymentStatus.color}`}>
                                        {paymentStatus.display}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      {appointments.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-green-600" />
              <h3 className="text-xs font-semibold text-gray-600">Total</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {appointments.length}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <h3 className="text-xs font-semibold text-gray-600">Scheduled</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {appointments.filter(a => a.status?.toLowerCase() === 'scheduled').length}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-5 w-5 text-blue-600" />
              <h3 className="text-xs font-semibold text-gray-600">Completed</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {appointments.filter(a => a.status?.toLowerCase() === 'completed').length}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-2 mb-2">
              <X className="h-5 w-5 text-red-600" />
              <h3 className="text-xs font-semibold text-gray-600">Cancelled</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {appointments.filter(a => a.status?.toLowerCase() === 'cancelled').length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAppointments;
