import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLowStockMedicines } from '../../../shared/api/pharmacistAPI';

const StockAlerts = () => {
  const navigate = useNavigate();
  const [lowStockMeds, setLowStockMeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLowStock();
  }, []);

  const fetchLowStock = async () => {
    try {
      setLoading(true);
      const data = await getLowStockMedicines();
      setLowStockMeds(data);
    } catch (err) {
      console.error(err);
      setLowStockMeds([]);
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
        <h1>⚠️ Stock Alerts</h1>
      </header>

      <main style={styles.main}>
        {loading && <p style={styles.message}>Loading...</p>}
        
        {!loading && lowStockMeds.length === 0 && (
          <p style={styles.message}>✅ All medicines have sufficient stock!</p>
        )}

        {!loading && lowStockMeds.length > 0 && (
          <div style={styles.grid}>
            {lowStockMeds.map((med) => (
              <div key={med.medicineid} style={styles.alertCard}>
                <h3>{med.medicinename}</h3>
                <p><strong>Stock:</strong> {med.stockquantity} units</p>
                <p><strong>Reorder Level:</strong> {med.reorderlevel}</p>
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  alertCard: {
    background: '#fef3c7',
    border: '2px solid #f59e0b',
    padding: '1.5rem',
    borderRadius: '12px',
  },
  message: {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    textAlign: 'center',
  },
};

export default StockAlerts;
    