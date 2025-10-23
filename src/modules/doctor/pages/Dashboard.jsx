import { useAuth } from '../../../shared/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>🩺 Doctor Dashboard</h1>
      <h2>Welcome, Dr. {user?.username || 'Doctor'}!</h2>
      
      <div style={{ marginTop: '20px', padding: '20px', background: '#e8f5e9', borderRadius: '8px' }}>
        <h3>User Information:</h3>
        <p><strong>ID:</strong> {user?.id}</p>
        <p><strong>Username:</strong> {user?.username}</p>
        <p><strong>Email:</strong> {user?.email || 'Not set'}</p>
        <p><strong>Role:</strong> {user?.role}</p>
        <p><strong>Specialization:</strong> {user?.specialization || 'General'}</p>
      </div>

      <div style={{ marginTop: '20px', padding: '20px', background: '#fff3e0', borderRadius: '8px' }}>
        <h3>Quick Actions:</h3>
        <ul>
          <li>View Patient Appointments</li>
          <li>Update Medical Records</li>
          <li>Prescribe Medications</li>
          <li>View Lab Reports</li>
        </ul>
      </div>

      <button 
        onClick={handleLogout}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          background: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default DoctorDashboard;
