import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Printer, Download } from 'lucide-react';
import { billingAPI, patientAPI, appointmentAPI, doctorAPI } from '../../../shared/api/receptionistAPI';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const billId = location.state?.billId;

  const [bill, setBill] = useState(null);
  const [patient, setPatient] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (billId) {
      fetchPaymentDetails();
    } else {
      navigate('/receptionist');
    }
  }, [billId, navigate]);

  const fetchPaymentDetails = async () => {
    try {
      setIsLoading(true);
      
      // Fetch bill details
      const billData = await billingAPI.getBillById(billId);
      console.log('✅ Bill fetched:', billData);
      setBill(billData);
      
      // Fetch patient details
      if (billData.Patient) {
        const patientData = await patientAPI.getPatientById(billData.Patient);
        setPatient(patientData);
      }
      
      // Fetch appointment details
      if (billData.Appointment) {
        const appointmentData = await appointmentAPI.getAppointmentById(billData.Appointment);
        setAppointment(appointmentData);
        
        // Fetch doctor details
        if (appointmentData.doctor) {
          const doctorsData = await doctorAPI.getAllDoctors();
          const doctorData = doctorsData.find(d => d.id === appointmentData.doctor);
          setDoctor(doctorData);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching payment details:', error);
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

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // In a real application, this would generate and download a PDF
    // For now, we'll use the browser's print to PDF functionality
    alert('Please use Print and select "Save as PDF" from your browser\'s print dialog');
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f5f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '18px', color: '#6b7280' }}>Loading...</div>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f5f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '18px', color: '#ef4444' }}>Payment details not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f5f7', padding: '40px 20px' }}>
      <div id="printable-content" style={{ maxWidth: '700px', margin: '0 auto' }}>
        {/* Success Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
          padding: '48px',
          textAlign: 'center'
        }}>
          {/* Success Icon */}
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#10b981',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <CheckCircle style={{ width: '48px', height: '48px', color: 'white' }} />
          </div>

          {/* Success Message */}
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1a1a1a',
            margin: 0,
            marginBottom: '12px'
          }}>
            Payment Successful!
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            margin: 0,
            marginBottom: '40px'
          }}>
            Your appointment has been confirmed with the details below:
          </p>

          {/* Appointment Details Card */}
          <div style={{
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            padding: '32px',
            textAlign: 'left',
            border: '1px solid #e5e7eb',
            marginBottom: '32px'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1a1a1a',
              textAlign: 'center',
              margin: 0,
              marginBottom: '8px'
            }}>
              TRINITY CARE HOSPITAL
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              textAlign: 'center',
              margin: 0,
              marginBottom: '24px'
            }}>
              Appointment Confirmation
            </p>

            {/* Details Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '600' }}>Doctor:</span>
                <span style={{ fontSize: '16px', color: '#1a1a1a', fontWeight: '700' }}>
                  Dr. {doctor?.user?.username || 'N/A'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '600' }}>Department:</span>
                <span style={{ fontSize: '16px', color: '#1a1a1a', fontWeight: '700' }}>
                  {doctor?.specialization?.name || 'General Medicine'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '600' }}>Date:</span>
                <span style={{ fontSize: '16px', color: '#1a1a1a', fontWeight: '700' }}>
                  {formatDate(appointment?.Appointment_date)}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '600' }}>Time:</span>
                <span style={{ fontSize: '16px', color: '#1a1a1a', fontWeight: '700' }}>
                  {formatTime(appointment?.Appointment_time)}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '600' }}>Patient ID:</span>
                <span style={{ fontSize: '16px', color: '#1a1a1a', fontWeight: '700' }}>
                  {patient?.Token || `PAT-${String(patient?.id).padStart(4, '0')}`}
                </span>
              </div>
            </div>

            {/* Slot Number - Highlighted */}
            <div style={{
              marginTop: '24px',
              padding: '20px',
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '2px solid #7c3aed',
              textAlign: 'center'
            }}>
              <p style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#7c3aed',
                margin: 0
              }}>
                Your Slot Number: {bill.Token || 'N/A'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            marginBottom: '24px'
          }}>
            <button
              onClick={handlePrint}
              style={{
                padding: '12px 24px',
                backgroundColor: 'white',
                color: '#7c3aed',
                border: '2px solid #7c3aed',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#f3f4f6';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'white';
              }}
            >
              <Printer style={{ width: '18px', height: '18px' }} />
              Print
            </button>

            <button
              onClick={handleDownloadPDF}
              style={{
                padding: '12px 24px',
                backgroundColor: '#7c3aed',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#6d28d9';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#7c3aed';
              }}
            >
              <Download style={{ width: '18px', height: '18px' }} />
              Download PDF
            </button>
          </div>

          {/* Back to Dashboard Button */}
          <button
            onClick={() => navigate('/receptionist')}
            style={{
              padding: '12px 32px',
              backgroundColor: 'white',
              color: '#6b7280',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.backgroundColor = '#f9fafb';
            }}
            onMouseOut={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.backgroundColor = 'white';
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            margin: 0.5in;
            size: A4;
          }
          
          body {
            margin: 0;
            padding: 0;
          }
          
          /* Hide everything first */
          body * {
            visibility: hidden;
          }
          
          /* Show only the printable content */
          #printable-content,
          #printable-content * {
            visibility: visible;
          }
          
          /* Position the printable content */
          #printable-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
            box-sizing: border-box;
          }
          
          /* Hide buttons in print */
          button {
            display: none !important;
          }
          
          /* Ensure colors and backgrounds are printed */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          /* Remove shadows and adjust spacing for print */
          #printable-content > div {
            box-shadow: none !important;
            border: 1px solid #e5e7eb;
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccess;
