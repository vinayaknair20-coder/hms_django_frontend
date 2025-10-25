import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CreditCard, Building2, Smartphone, Wallet, Lock } from 'lucide-react';
import { billingAPI, patientAPI, doctorAPI, appointmentAPI } from '../../../shared/api/receptionistAPI';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { billId } = useParams();
  
  const [bill, setBill] = useState(null);
  const [patient, setPatient] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('credit_card');

  useEffect(() => {
    if (billId) {
      fetchBillDetails();
    }
  }, [billId]);

  const fetchBillDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch bill details
      const billData = await billingAPI.getBillById(billId);
      console.log('✅ Bill fetched:', billData);
      setBill(billData);
      
      // Fetch patient details
      if (billData.Patient) {
        const patientData = await patientAPI.getPatientById(billData.Patient);
        console.log('✅ Patient fetched:', patientData);
        setPatient(patientData);
      }
      
      // Fetch appointment details
      if (billData.Appointment) {
        const appointmentData = await appointmentAPI.getAppointmentById(billData.Appointment);
        console.log('✅ Appointment fetched:', appointmentData);
        setAppointment(appointmentData);
        
        // ✅ FIXED: Fetch doctor details using getDoctorById
        if (appointmentData.doctor) {
          try {
            const doctorData = await doctorAPI.getDoctorById(appointmentData.doctor);
            console.log('✅ Doctor fetched:', doctorData);
            setDoctor(doctorData);
          } catch (err) {
            console.warn('⚠️ Failed to fetch doctor details, trying getAllDoctors', err);
            // Fallback: get from list
            const doctorsData = await doctorAPI.getAllDoctors();
            const doctorData = doctorsData.find(d => d.id === appointmentData.doctor);
            console.log('✅ Doctor fetched from list:', doctorData);
            setDoctor(doctorData);
          }
        }
      }
    } catch (err) {
      console.error('❌ Failed to fetch bill details:', err);
      setError('Failed to load bill details. Please try again.');
    } finally {
      setIsLoading(false);
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
    if (!timeString) return 'N/A';
    return timeString;
  };

  const calculateServiceTax = () => {
    if (!bill) return 0;
    const subtotal = parseFloat(bill.registration_fee || 0) + parseFloat(bill.consultation_fee || 0);
    return (subtotal * 0.05).toFixed(2); // 5% tax
  };

  const handlePayment = () => {
    // In a real application, this would process the payment
    // Navigate to payment success page with bill ID
    navigate('/receptionist/payment-success', { 
      state: { billId: bill.id } 
    });
  };

  // ✅ NEW: Helper function to get doctor name
  const getDoctorName = () => {
    if (!doctor) return 'N/A';
    
    // Try different name formats
    if (doctor.full_name) return doctor.full_name;
    
    const firstName = doctor.first_name || '';
    const lastName = doctor.last_name || '';
    if (firstName || lastName) {
      return `Dr. ${firstName} ${lastName}`.trim();
    }
    
    if (doctor.username) return `Dr. ${doctor.username}`;
    if (doctor.user?.username) return `Dr. ${doctor.user.username}`;
    if (doctor.user?.first_name || doctor.user?.last_name) {
      return `Dr. ${doctor.user.first_name || ''} ${doctor.user.last_name || ''}`.trim();
    }
    
    return 'N/A';
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
          Loading payment details...
        </div>
      </div>
    );
  }

  if (error || !bill) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f5f5f7' }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          gap: '16px'
        }}>
          <div style={{ fontSize: '18px', color: '#ef4444' }}>
            {error || 'Bill not found'}
          </div>
          <button
            onClick={() => navigate('/receptionist/billing')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Back to Billing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f5f7' }}>
      {/* Header */}
      <header style={{ 
        background: 'linear-gradient(90deg, #7c3aed 0%, #6d28d9 100%)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        padding: '16px 0'
      }}>
        <div style={{ 
          maxWidth: '1000px', 
          margin: '0 auto', 
          padding: '0 24px',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '24px' }}>🏥</span>
            </div>
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              color: 'white',
              margin: 0,
              letterSpacing: '0.5px'
            }}>
              TRINITY CARE HOSPITAL
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Payment Header */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          padding: '32px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#f3f4f6',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CreditCard style={{ width: '32px', height: '32px', color: '#7c3aed' }} />
            </div>
            <div>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                color: '#1a1a1a',
                margin: 0,
                marginBottom: '4px'
              }}>
                Fee Payment
              </h2>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                Bill ID: {bill.Token || `BILL-${String(bill.id).padStart(4, '0')}`}
              </p>
            </div>
          </div>

          {/* Patient Details */}
          {patient && (
            <div style={{
              backgroundColor: '#f0f9ff',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '16px',
              border: '1px solid #bae6fd'
            }}>
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: '700', 
                color: '#1a1a1a',
                margin: 0,
                marginBottom: '16px'
              }}>
                Patient Details
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>Patient ID:</span>
                  <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                    {patient.Token || `PAT-${String(patient.id).padStart(4, '0')}`}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>Patient Name:</span>
                  <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                    {patient.Patient_name}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>Phone Number:</span>
                  <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                    {patient.phone}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Doctor & Appointment Info */}
          <div style={{
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '24px'
          }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '700', 
              color: '#1a1a1a',
              margin: 0,
              marginBottom: '16px'
            }}>
              Appointment Details
            </h3>
            {/* ✅ FIXED: Display doctor name using helper function */}
            <div style={{ 
              fontSize: '18px', 
              fontWeight: '700', 
              color: '#1a1a1a',
              marginBottom: '8px'
            }}>
              {getDoctorName()}
            </div>
            {doctor && (doctor.specialization?.name || doctor.specialization_name) && (
              <div style={{
                backgroundColor: '#7c3aed',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                display: 'inline-block',
                marginBottom: '16px'
              }}>
                {doctor.specialization?.name || doctor.specialization_name}
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>Department:</span>
                <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                  {doctor?.specialization?.name || doctor?.specialization_name || 'General Medicine'}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>Appointment Date:</span>
                <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                  {formatDate(appointment?.Appointment_date)}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>Appointment Time:</span>
                <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                  {formatTime(appointment?.Appointment_time)}
                </div>
              </div>
            </div>
          </div>

          {/* Fee Breakdown */}
          <div>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '700', 
              color: '#1a1a1a',
              margin: 0,
              marginBottom: '16px'
            }}>
              Fee Breakdown
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Consultation Fee</span>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a' }}>
                  ₹{parseFloat(bill.consultation_fee || 0).toFixed(2)}
                </span>
              </div>
              
              {parseFloat(bill.registration_fee || 0) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Hospital Charges</span>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a' }}>
                    ₹{parseFloat(bill.registration_fee || 0).toFixed(2)}
                  </span>
                </div>
              )}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Service Tax (5%)</span>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a' }}>
                  ₹{calculateServiceTax()}
                </span>
              </div>
              
              <div style={{
                borderTop: '2px solid #e5e7eb',
                paddingTop: '12px',
                marginTop: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '18px', fontWeight: '700', color: '#7c3aed' }}>Total Amount</span>
                <span style={{ fontSize: '24px', fontWeight: '700', color: '#7c3aed' }}>
                  ₹{(parseFloat(bill.Amount || 0) + parseFloat(calculateServiceTax())).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          padding: '32px',
          marginBottom: '24px'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '700', 
            color: '#1a1a1a',
            margin: 0,
            marginBottom: '20px'
          }}>
            Select Payment Method
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Credit/Debit Card */}
            <button
              onClick={() => setSelectedPaymentMethod('credit_card')}
              style={{
                padding: '16px',
                backgroundColor: selectedPaymentMethod === 'credit_card' ? '#ede9fe' : 'white',
                border: selectedPaymentMethod === 'credit_card' ? '2px solid #7c3aed' : '1px solid #e5e7eb',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textAlign: 'left'
              }}
            >
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                border: '2px solid #7c3aed',
                backgroundColor: selectedPaymentMethod === 'credit_card' ? '#7c3aed' : 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {selectedPaymentMethod === 'credit_card' && (
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white' }} />
                )}
              </div>
              <CreditCard style={{ width: '20px', height: '20px', color: '#7c3aed' }} />
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
                Credit/Debit Card
              </span>
            </button>

            {/* Net Banking */}
            <button
              onClick={() => setSelectedPaymentMethod('net_banking')}
              style={{
                padding: '16px',
                backgroundColor: selectedPaymentMethod === 'net_banking' ? '#ede9fe' : 'white',
                border: selectedPaymentMethod === 'net_banking' ? '2px solid #7c3aed' : '1px solid #e5e7eb',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textAlign: 'left'
              }}
            >
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                border: '2px solid #7c3aed',
                backgroundColor: selectedPaymentMethod === 'net_banking' ? '#7c3aed' : 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {selectedPaymentMethod === 'net_banking' && (
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white' }} />
                )}
              </div>
              <Building2 style={{ width: '20px', height: '20px', color: '#7c3aed' }} />
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
                Net Banking
              </span>
            </button>

            {/* UPI Payment */}
            <button
              onClick={() => setSelectedPaymentMethod('upi')}
              style={{
                padding: '16px',
                backgroundColor: selectedPaymentMethod === 'upi' ? '#ede9fe' : 'white',
                border: selectedPaymentMethod === 'upi' ? '2px solid #7c3aed' : '1px solid #e5e7eb',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textAlign: 'left'
              }}
            >
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                border: '2px solid #7c3aed',
                backgroundColor: selectedPaymentMethod === 'upi' ? '#7c3aed' : 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {selectedPaymentMethod === 'upi' && (
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white' }} />
                )}
              </div>
              <Smartphone style={{ width: '20px', height: '20px', color: '#7c3aed' }} />
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
                UPI Payment
              </span>
            </button>

            {/* Wallet */}
            <button
              onClick={() => setSelectedPaymentMethod('wallet')}
              style={{
                padding: '16px',
                backgroundColor: selectedPaymentMethod === 'wallet' ? '#ede9fe' : 'white',
                border: selectedPaymentMethod === 'wallet' ? '2px solid #7c3aed' : '1px solid #e5e7eb',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textAlign: 'left'
              }}
            >
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                border: '2px solid #7c3aed',
                backgroundColor: selectedPaymentMethod === 'wallet' ? '#7c3aed' : 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {selectedPaymentMethod === 'wallet' && (
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white' }} />
                )}
              </div>
              <Wallet style={{ width: '20px', height: '20px', color: '#7c3aed' }} />
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
                Wallet
              </span>
            </button>
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: '#7c3aed',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#6d28d9';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#7c3aed';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          <Lock style={{ width: '20px', height: '20px' }} />
          Pay ₹{(parseFloat(bill.Amount || 0) + parseFloat(calculateServiceTax())).toFixed(2)}
        </button>
      </main>
    </div>
  );
};

export default PaymentPage;
