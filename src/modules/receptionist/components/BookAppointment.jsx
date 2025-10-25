import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, Calendar, Clock, User, Stethoscope } from 'lucide-react';
import { patientAPI, appointmentAPI, doctorAPI } from '../../../shared/api/receptionistAPI';

const BookAppointment = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const location = useLocation();
  
  const [patient, setPatient] = useState(location.state?.patientData || null);
  const [isLoadingPatient, setIsLoadingPatient] = useState(!patient && patientId);
  
  // ✅ FIXED: Removed Appointment_time from formData
  const [formData, setFormData] = useState({
    Patient: patientId || '',
    doctor: '',
    Appointment_date: ''
    // ✅ Appointment_time removed - backend will auto-generate
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [isLoadingData, setIsLoadingData] = useState(true);

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoadingData(true);
        
        const [patientsData, doctorsData, specializationsData] = await Promise.all([
          patientAPI.getAllPatients(),
          doctorAPI.getAllDoctors(),
          doctorAPI.getAllSpecializations()
        ]);
        
        setPatients(patientsData || []);
        setAllDoctors(doctorsData || []);
        setDoctors(doctorsData || []);
        setSpecializations(specializationsData || []);
        
        if (patientId && !patient) {
          const patientData = await patientAPI.getPatientById(patientId);
          setPatient(patientData);
          setFormData(prev => ({
            ...prev,
            Patient: patientData.id
          }));
        } else if (patient) {
          setFormData(prev => ({
            ...prev,
            Patient: patient.id || patientId
          }));
        }
      } catch (error) {
        console.error('❌ Failed to fetch initial data:', error);
        
        if (error.response?.status === 403) {
          alert('Permission Error: Unable to fetch doctors and specializations.');
        } else if (error.response?.status === 401) {
          alert('Authentication Error: Please log in again.');
        } else if (!error.response) {
          alert('Network Error: Unable to connect to backend server.');
        } else {
          alert(`API Error: ${error.response?.data?.detail || error.message}`);
        }
        
        setPatients([]);
        setAllDoctors([]);
        setDoctors([]);
        setSpecializations([]);
      } finally {
        setIsLoadingData(false);
        setIsLoadingPatient(false);
      }
    };

    fetchInitialData();
  }, [patientId, patient]);

  useEffect(() => {
    if (selectedSpecialization) {
      const filteredDoctors = allDoctors.filter(doctor => {
        let specializationId;
        
        if (typeof doctor?.specialization === 'number') {
          specializationId = doctor.specialization;
        } else if (typeof doctor?.specialization === 'object' && doctor?.specialization?.id) {
          specializationId = doctor.specialization.id;
        } else {
          return false;
        }
        
        return specializationId && specializationId.toString() === selectedSpecialization;
      });
      
      setDoctors(filteredDoctors);
    } else {
      setDoctors(allDoctors);
    }
    
    setFormData(prev => ({
      ...prev,
      doctor: ''
    }));
  }, [selectedSpecialization, allDoctors]);

  // ✅ UPDATED: Validation with 3-month limit
  const validateForm = () => {
    const newErrors = {};

    if (!formData.Patient) {
      newErrors.Patient = 'Patient is required';
    }

    if (!formData.Appointment_date) {
      newErrors.Appointment_date = 'Appointment date is required';
    } else {
      const selectedDate = new Date(formData.Appointment_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.Appointment_date = 'Appointment date cannot be in the past';
      }
      
      const threeMonthsLater = new Date(today);
      threeMonthsLater.setMonth(today.getMonth() + 3);
      threeMonthsLater.setHours(23, 59, 59, 999);
      
      if (selectedDate > threeMonthsLater) {
        newErrors.Appointment_date = 'Appointments can only be booked up to 3 months in advance';
      }
    }

    if (!formData.doctor) {
      newErrors.doctor = 'Doctor is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Booking appointment with backend data:', formData);
      
      const response = await appointmentAPI.createAppointment(formData);
      console.log('Appointment created successfully:', response);
      
      navigate('/receptionist/bill-generation', { 
        state: { 
          appointmentData: response 
        } 
      });
    } catch (error) {
      console.error('Error booking appointment:', error);
      
      let errorMessage = 'Failed to book appointment. Please try again.';
      if (error.response && error.response.data) {
        if (error.response.data.doctor) {
          errorMessage = error.response.data.doctor;
        } else if (error.response.data.Appointment_date) {
          errorMessage = error.response.data.Appointment_date;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData || isLoadingPatient) {
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
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f5f7' }}>
      <header style={{ 
        background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        padding: '16px 0'
      }}>
        <div style={{ 
          maxWidth: '1280px', 
          margin: '0 auto', 
          padding: '0 24px',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '20px' }}>🏥</span>
            </div>
            <div>
              <h1 style={{ 
                fontSize: '20px', 
                fontWeight: '700', 
                color: 'white',
                margin: 0,
                letterSpacing: '0.3px'
              }}>
                TRINITY CARE HOSPITAL
              </h1>
              <p style={{ 
                fontSize: '12px', 
                color: 'rgba(255, 255, 255, 0.85)',
                margin: 0,
                marginTop: '2px'
              }}>
                Receptionist Portal
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/receptionist')}
            style={{
              padding: '8px 20px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            Back to Dashboard
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            color: '#1a1a1a',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Calendar style={{ width: '32px', height: '32px', color: '#6366f1' }} />
            Book Appointment
          </h2>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            Schedule a new appointment for the patient
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '32px',
          border: '1px solid #e5e7eb'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#1a1a1a',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <User style={{ width: '20px', height: '20px', color: '#6366f1' }} />
                Patient Selection
              </h3>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Select Patient <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  name="Patient"
                  value={formData.Patient}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '14px',
                    border: errors.Patient ? '2px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                >
                  <option value="">Select Patient</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.Token || `PAT-${String(patient.id).padStart(4, '0')}`} - {patient.Patient_name}
                    </option>
                  ))}
                </select>
                {errors.Patient && (
                  <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                    {errors.Patient}
                  </p>
                )}
              </div>

              {formData.Patient && (
                <div style={{
                  backgroundColor: '#f0f9ff',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #0ea5e9'
                }}>
                  {(() => {
                    const selectedPatient = patients.find(p => p.id.toString() === formData.Patient);
                    return selectedPatient ? (
                      <div>
                        <h4 style={{ margin: 0, marginBottom: '8px', color: '#0c4a6e' }}>
                          Selected Patient Details
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                          <div style={{
                            backgroundColor: 'white',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #bae6fd'
                          }}>
                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Patient ID:</span>
                            <div style={{ fontWeight: '700', fontSize: '14px', color: '#0c4a6e' }}>
                              PAT-{String(selectedPatient.id).padStart(4, '0')}
                            </div>
                          </div>
                          <div style={{
                            backgroundColor: 'white',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #bae6fd'
                          }}>
                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Patient Name:</span>
                            <div style={{ fontWeight: '700', fontSize: '14px', color: '#0c4a6e' }}>
                              {selectedPatient.Patient_name}
                            </div>
                          </div>
                          <div style={{
                            backgroundColor: 'white',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #bae6fd'
                          }}>
                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Phone:</span>
                            <div style={{ fontWeight: '700', fontSize: '14px', color: '#0c4a6e' }}>
                              {selectedPatient.phone}
                            </div>
                          </div>
                          <div style={{
                            backgroundColor: 'white',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #bae6fd'
                          }}>
                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Blood Group:</span>
                            <div style={{ fontWeight: '700', fontSize: '14px', color: '#0c4a6e' }}>
                              {selectedPatient.blood_group || 'Not specified'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#1a1a1a',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Calendar style={{ width: '20px', height: '20px', color: '#6366f1' }} />
                Appointment Details
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Appointment Date <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="date"
                    name="Appointment_date"
                    value={formData.Appointment_date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    max={(() => {
                      const today = new Date();
                      const threeMonthsLater = new Date(today);
                      threeMonthsLater.setMonth(today.getMonth() + 3);
                      return threeMonthsLater.toISOString().split('T')[0];
                    })()}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: '14px',
                      border: errors.Appointment_date ? '2px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: '8px',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                  />
                  {errors.Appointment_date && (
                    <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                      {errors.Appointment_date}
                    </p>
                  )}
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    Appointments can be booked up to 3 months in advance
                  </p>
                </div>
                
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Specialization (Optional)
                  </label>
                  <select
                    value={selectedSpecialization}
                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: '14px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                  >
                    <option value="">All Specializations</option>
                    {specializations.map(spec => (
                      <option key={spec.id} value={spec.id}>
                        {spec.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  <Stethoscope style={{ width: '14px', height: '14px', display: 'inline', marginRight: '4px' }} />
                  Doctor <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '14px',
                    border: errors.doctor ? '2px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                >
                  <option value="">
                    {selectedSpecialization 
                      ? `Select Doctor from ${specializations.find(s => s.id.toString() === selectedSpecialization)?.name || 'Selected Specialization'}`
                      : 'Select Doctor (All Specializations)'
                    }
                  </option>
                  {doctors.map(doctor => {
                    const doctorName = doctor.full_name || 
                                      `Dr. ${doctor.first_name || ''} ${doctor.last_name || ''}`.trim() ||
                                      `Dr. ${doctor.username || doctor.user?.username || 'Unknown'}`;
                    const specializationName = doctor.specialization_name || doctor.specialization?.name || 'General';
                    
                    return (
                      <option key={doctor.id} value={doctor.id}>
                        {doctorName} - {specializationName}
                      </option>
                    );
                  })}
                </select>
                {errors.doctor && (
                  <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                    {errors.doctor}
                  </p>
                )}
                
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  {selectedSpecialization 
                    ? `${doctors.length} doctor(s) available in ${specializations.find(s => s.id.toString() === selectedSpecialization)?.name || 'selected specialization'}`
                    : `${doctors.length} doctor(s) available (all specializations)`
                  }
                </p>
              </div>

              {formData.doctor && (
                <div style={{
                  backgroundColor: '#f0f9ff',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid #0ea5e9',
                  marginBottom: '24px'
                }}>
                  {(() => {
                    const selectedDoctor = doctors.find(d => d.id.toString() === formData.doctor);
                    if (!selectedDoctor) return null;
                    
                    const doctorName = selectedDoctor.full_name ||
                                      `Dr. ${selectedDoctor.first_name || ''} ${selectedDoctor.last_name || ''}`.trim() ||
                                      `Dr. ${selectedDoctor.username || selectedDoctor.user?.username || 'Unknown'}`;
                    
                    return (
                      <div>
                        <h4 style={{ 
                          margin: 0, 
                          marginBottom: '16px', 
                          color: '#0c4a6e',
                          fontSize: '16px',
                          fontWeight: '700',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <Stethoscope style={{ width: '18px', height: '18px' }} />
                          Selected Doctor Details
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                          <div style={{
                            backgroundColor: 'white',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #bae6fd'
                          }}>
                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Doctor Name:</span>
                            <div style={{ fontWeight: '700', fontSize: '14px', color: '#0c4a6e' }}>
                              {doctorName}
                            </div>
                          </div>
                          <div style={{
                            backgroundColor: 'white',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #bae6fd'
                          }}>
                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Specialization:</span>
                            <div style={{ fontWeight: '700', fontSize: '14px', color: '#0c4a6e' }}>
                              {selectedDoctor.specialization_name || selectedDoctor.specialization?.name || 'General Medicine'}
                            </div>
                          </div>
                          <div style={{
                            backgroundColor: 'white',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #bae6fd'
                          }}>
                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Experience:</span>
                            <div style={{ fontWeight: '700', fontSize: '14px', color: '#0c4a6e' }}>
                              {selectedDoctor.experience} years
                            </div>
                          </div>
                          <div style={{
                            backgroundColor: 'white',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #bae6fd'
                          }}>
                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Consultation Fee:</span>
                            <div style={{ fontWeight: '700', fontSize: '14px', color: '#059669' }}>
                              ₹{selectedDoctor.consultation_fee}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => navigate(-1)}
                style={{
                  padding: '10px 24px',
                  backgroundColor: 'white',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#f9fafb';
                  e.target.style.borderColor = '#9ca3af';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.borderColor = '#d1d5db';
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: '10px 24px',
                  backgroundColor: isSubmitting ? '#9ca3af' : '#6366f1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => !isSubmitting && (e.target.style.backgroundColor = '#4f46e5')}
                onMouseOut={(e) => !isSubmitting && (e.target.style.backgroundColor = '#6366f1')}
              >
                <Save style={{ width: '16px', height: '16px' }} />
                {isSubmitting ? 'Booking...' : 'Book Appointment'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer style={{ 
        background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
        marginTop: '80px',
        padding: '16px 0'
      }}>
        <div style={{ 
          maxWidth: '1280px', 
          margin: '0 auto', 
          padding: '0 24px'
        }}>
          <p style={{ 
            textAlign: 'center', 
            color: 'white', 
            fontSize: '13px',
            margin: 0,
            fontWeight: '400'
          }}>
            © 2023 Trinity Care Hospital. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BookAppointment;
