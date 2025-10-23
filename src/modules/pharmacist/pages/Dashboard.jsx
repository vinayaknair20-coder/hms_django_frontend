import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllMedicines, getPendingPrescriptions } from '../../../shared/api/pharmacistAPI';
import { useAuth } from '../../../shared/context/AuthContext';

const PharmacistDashboard = () => {
  const { user, logout, getUserName } = useAuth();
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [pendingPrescriptions, setPendingPrescriptions] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get medicines
        const medicinesData = await getAllMedicines();
        setMedicines(medicinesData);
        
        // Try to get pending prescriptions, but don't break if it fails
        try {
          const pendingData = await getPendingPrescriptions();
          setPendingPrescriptions(pendingData.pending_prescriptions || []);
        } catch (prescError) {
          console.warn('Could not fetch pending prescriptions:', prescError);
          setPendingPrescriptions([]);
        }
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>💊 Pharmacist Dashboard</h1>
        <div style={styles.userInfo}>
          <span style={styles.userName}>{getUserName()}</span>
          <button onClick={logout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.welcomeCard}>
          <h2>Welcome, {getUserName()}! 💊</h2>
          <p>Manage pharmacy inventory and prescriptions</p>
        </div>

        <div style={styles.grid}>
          <div style={styles.card}>
            <h3>💊 Medicines</h3>
            <p className="stat">{medicines.length} In Stock</p>
            <button 
              style={styles.actionBtn}
              onClick={() => navigate('/pharmacist/medicines')}
            >
              View Medicines
            </button>
          </div>

          <div style={styles.card}>
            <h3>📋 Prescriptions</h3>
            <p className="stat">{pendingPrescriptions.length} Pending</p>
            <button 
              style={styles.actionBtn}
              onClick={() => navigate('/pharmacist/prescriptions')}
            >
              View Prescriptions
            </button>
          </div>

          <div style={styles.card}>
            <h3>💰 Billing</h3>
            <p className="stat">Quick Sale</p>
            <button 
              style={styles.actionBtn}
              onClick={() => navigate('/pharmacist/quick-sale')}
            >
              Start Billing
            </button>
          </div>

          <div style={styles.card}>
            <h3>⚠️ Stock Alerts</h3>
            <p className="stat">Check Low Stock</p>
            <button 
              style={styles.actionBtn}
              onClick={() => navigate('/pharmacist/stock-alerts')}
            >
              View Alerts
            </button>
          </div>
        </div>

        <div style={styles.infoBox}>
          <h3>👨‍⚕️ Pharmacist Profile</h3>
          <p><strong>User ID:</strong> {user?.id}</p>
          <p><strong>Name:</strong> {getUserName()}</p>
          <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
          <p>
            <strong>Role:</strong>{' '}
            <span style={styles.roleBadge}>{user?.role}</span>
          </p>
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  },
  header: {
    background: 'white',
    padding: '1.5rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userName: {
    fontWeight: 600,
    color: '#333',
  },
  logoutBtn: {
    padding: '0.5rem 1.5rem',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  welcomeCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '2rem',
    marginBottom: '2rem',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  },
  actionBtn: {
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    background: '#f59e0b',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    width: '100%',
    fontWeight: 600,
    transition: 'all 0.3s ease',
  },
  infoBox: {
    background: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  },
  roleBadge: {
    background: '#f59e0b',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.9rem',
  },
};

export default PharmacistDashboard;
