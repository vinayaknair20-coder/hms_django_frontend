import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllMedicines } from '../../../shared/api/pharmacistAPI';

const MedicineInventory = () => {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const data = await getAllMedicines();
      setMedicines(data);
      setError(null);
    } catch (err) {
      setError('Failed to load medicines');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMedicines = medicines.filter(med =>
    med.medicinename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.genericname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={() => navigate('/pharmacist/dashboard')} style={styles.backBtn}>
          ← Back to Dashboard
        </button>
        <h1>💊 Medicine Inventory</h1>
      </header>

      <main style={styles.main}>
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="🔍 Search medicines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {loading && <p style={styles.message}>Loading medicines...</p>}
        {error && <p style={styles.error}>{error}</p>}
        
        {!loading && !error && (
          <>
            <div style={styles.stats}>
              <p><strong>Total Medicines:</strong> {filteredMedicines.length}</p>
            </div>

            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Medicine ID</th>
                    <th style={styles.th}>Medicine Name</th>
                    <th style={styles.th}>Generic Name</th>
                    <th style={styles.th}>Manufacturer</th>
                    <th style={styles.th}>Unit Price</th>
                    <th style={styles.th}>Stock Qty</th>
                    <th style={styles.th}>Expiry Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedicines.map((medicine) => (
                    <tr key={medicine.medicineid} style={styles.tr}>
                      <td style={styles.td}>{medicine.medicineid}</td>
                      <td style={styles.td}>{medicine.medicinename}</td>
                      <td style={styles.td}>{medicine.genericname}</td>
                      <td style={styles.td}>{medicine.manufacturer}</td>
                      <td style={styles.td}>₹{medicine.unitprice}</td>
                      <td style={styles.td}>{medicine.stockquantity}</td>
                      <td style={styles.td}>{medicine.expirydate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
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
    maxWidth: '1400px',
    margin: '0 auto',
  },
  searchBox: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    marginBottom: '2rem',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  },
  searchInput: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
  },
  stats: {
    background: 'white',
    padding: '1rem 2rem',
    borderRadius: '12px',
    marginBottom: '2rem',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  },
  tableContainer: {
    background: 'white',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '1rem',
    textAlign: 'left',
    borderBottom: '2px solid #f59e0b',
    background: '#fef3c7',
    fontWeight: 600,
  },
  tr: {
    borderBottom: '1px solid #e5e7eb',
  },
  td: {
    padding: '1rem',
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

export default MedicineInventory;
