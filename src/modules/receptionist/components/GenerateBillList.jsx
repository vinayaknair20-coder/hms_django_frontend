import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, FileText, Calendar, User, Stethoscope } from 'lucide-react';
import { appointmentAPI, patientAPI, doctorAPI } from '../../../shared/api/receptionistAPI';

const GenerateBillList = () => {
  const navigate = useNavigate();
  
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [searchQuery, appointments]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all appointments
      const appointmentsData = await appointmentAPI.getAllAppointments();
      console.log('✅ Appointments fetched:', appointmentsData);
      
      // Ensure appointmentsData is an array
      const appointmentsArray = Array.isArray(appointmentsData) ? appointmentsData : [];
      setAppointments(appointmentsArray);
      setFilteredAppointments(appointmentsArray);
      
      // Fetch patients
      const patientsData = await patientAPI.getAllPatients();
      console.log('✅ Patients fetched:', patientsData);
      setPatients(patientsData);
      
      // Fetch doctors
      const doctorsData = await doctorAPI.getAllDoctors();
      console.log('✅ Doctors fetched:', doctorsData);
      setDoctors(doctorsData);
      
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      let errorMessage = 'Failed to load appointments. ';
      if (error.response?.status === 404) {
        errorMessage += 'Appointments endpoint not found. Please check backend.';
      } else if (error.response?.status === 500) {
        errorMessage += 'Server error. Please check backend logs.';
      } else if (error.message) {
        errorMessage += error.message;
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAppointments = () => {
    if (!searchQuery.trim()) {
      setFilteredAppointments(appointments);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = appointments.filter(appointment => {
      // Search by appointment ID
      if (appointment.id.toString().includes(query)) {
        return true;
      }
      
      // Search by patient ID
      if (appointment.Patient.toString().includes(query)) {
        return true;
      }
      
      // Search by patient name
      const patient = patients.find(p => p.id === appointment.Patient);
      if (patient && patient.Patient_name.toLowerCase().includes(query)) {
        return true;
      }
      
      // Search by patient token
      if (patient && patient.Token && patient.Token.toLowerCase().includes(query)) {
        return true;
      }
      
      return false;
    });
    
    setFilteredAppointments(filtered);
  };

  const getPatientInfo = (patientId) => {
    return patients.find(p => p.id === patientId) || {};
  };

  const getDoctorInfo = (doctorId) => {
    return doctors.find(d => d.id === doctorId) || {};
  };

  const handleGenerateBill = (appointment) => {
    // Navigate to bill generation page with appointment data
    navigate('/receptionist/bill-generation', {
      state: { appointmentData: appointment }
    });
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

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f5f5f7' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '18px',
          color: '#6b7280'
        }}>
          Loading appointments...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f5f7' }}>
      {/* Header */}
      <header style={{ 
        background: 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        padding: '16px 0'
      }}>
        <div style={{ 
          maxWidth: '1280px', 
          margin: '0 auto', 
          padding: '0 24px',
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px'
        }}>
          <button
            onClick={() => navigate('/receptionist')}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
          >
            <ArrowLeft style={{ width: '20px', height: '20px', color: 'white' }} />
          </button>
          <div>
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              color: 'white',
              margin: 0
            }}>
              Generate Bill
            </h1>
            <p style={{ 
              fontSize: '13px', 
              color: 'rgba(255, 255, 255, 0.9)',
              margin: 0,
              marginTop: '2px'
            }}>
              Select an appointment to generate bill
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Search Bar */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ position: 'relative' }}>
            <Search style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '20px',
              color: '#6b7280'
            }} />
            <input
              type="text"
              placeholder="Search by Appointment ID, Patient ID, or Patient Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 14px 14px 48px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '500',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
          <p style={{ 
            fontSize: '13px', 
            color: '#6b7280', 
            margin: 0, 
            marginTop: '12px' 
          }}>
            {filteredAppointments.length} appointment(s) found
          </p>
        </div>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '48px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}>
            <FileText style={{ width: '48px', height: '48px', color: '#d1d5db', margin: '0 auto 16px' }} />
            <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
              No appointments found
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {filteredAppointments.map((appointment) => {
              const patient = getPatientInfo(appointment.Patient);
              const doctor = getDoctorInfo(appointment.doctor);
              
              return (
                <div
                  key={appointment.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    border: '1px solid #e5e7eb',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.12)';
                    e.currentTarget.style.borderColor = '#f59e0b';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px' }}>
                    {/* Left Side - Appointment Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{
                          backgroundColor: '#fffbeb',
                          padding: '8px',
                          borderRadius: '8px'
                        }}>
                          <Calendar style={{ width: '20px', height: '20px', color: '#f59e0b' }} />
                        </div>
                        <div>
                          <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                            Appointment ID: #{appointment.id}
                          </p>
                          <p style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
                            {formatDate(appointment.Appointment_date)}
                          </p>
                        </div>
                      </div>

                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px'
                      }}>
                        {/* Patient Info */}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <User style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                            <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>Patient</span>
                          </div>
                          <p style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', margin: 0 }}>
                            {patient.Patient_name || 'N/A'}
                          </p>
                          <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                            ID: {patient.Token || `PAT-${String(patient.id).padStart(4, '0')}`}
                          </p>
                        </div>

                        {/* Doctor Info */}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <Stethoscope style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                            <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>Doctor</span>
                          </div>
                          <p style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', margin: 0 }}>
                            Dr. {doctor.user?.username || 'N/A'}
                          </p>
                          <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                            {doctor.specialization?.name || 'General'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Generate Bill Button */}
                    <button
                      onClick={() => handleGenerateBill(appointment)}
                      style={{
                        padding: '12px 24px',
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#d97706'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#f59e0b'}
                    >
                      <FileText style={{ width: '18px', height: '18px' }} />
                      Generate Bill
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default GenerateBillList;
