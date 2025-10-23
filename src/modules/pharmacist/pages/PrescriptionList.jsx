import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPendingPrescriptions } from '../../../shared/api/pharmacistAPI';

const PrescriptionList = () => {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const data = await getPendingPrescriptions();
      setPrescriptions(data.pending_prescriptions || []);
      setError(null);
    } catch (err) {
      setError('Failed to load prescriptions. Backend API may not be configured.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={() => navigate('/pharmacist/dashboard')} style={styles.backBtn}>
          ← Back to Dashboard
        </button>
        <h1>📋 Pending Prescriptions</h1>
      </header>

      <main style={styles.main}>
        {loading && <p style={styles.message}>Loading prescriptions...</p>}
        {error && <p style={styles.error}>{error}</p>}
        
        {!loading && !error && prescriptions.length === 0 && (
          <p style={styles.message}>No pending prescriptions found.</p>
        )}

        {!loading && !error && prescriptions.length > 0 && (
          <div style={styles.grid}>
            {prescriptions.map((prescription) => (
              <div key={prescription.prescriptionid} style={styles.card}>
                <h3>Prescription #{prescription.prescriptionid}</h3>
                <p><strong>Patient:</strong> {prescription.patient_name}</p>
                <p><strong>Doctor:</strong> {prescription.doctor_name}</p>
                <p><strong>Date:</strong> {prescription.prescriptiondate}</p>
                <button style={styles.viewBtn}>View Details</button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    padding: '2rem',
  },
  header: {
    background: 'white',
    padding: '1.5rem 2rem',
    borderRadius: '12px',
    marginBottom: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  backBtn: {
    padding: '0.5rem 1rem',
    background: '#f59e0b',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginBottom: '1rem',
    fontWeight: 600,
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  },
  viewBtn: {
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    background: '#f59e0b',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    width: '100%',
    fontWeight: 600,
  },
  message: {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    textAlign: 'center',
  },
  error: {
    background: '#fee2e2',
    color: '#dc2626',
    padding: '1rem',
    borderRadius: '8px',
    textAlign: 'center',
  },
};

export default PrescriptionList;
