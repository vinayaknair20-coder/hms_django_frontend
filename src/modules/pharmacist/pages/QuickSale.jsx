import { useNavigate } from 'react-router-dom';

const QuickSale = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={() => navigate('/pharmacist/dashboard')} style={styles.backBtn}>
          ← Back to Dashboard
        </button>
        <h1>💰 Quick Sale</h1>
      </header>

      <main style={styles.main}>
        <div style={styles.message}>
          <h2>🚧 Under Construction</h2>
          <p>Quick Sale feature coming soon!</p>
        </div>
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
  message: {
    background: 'white',
    padding: '4rem 2rem',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
};

export default QuickSale;
