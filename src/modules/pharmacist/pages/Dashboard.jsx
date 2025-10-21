import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pharmacistAPI } from '../../../shared/api/pharmacistAPI';
import { authAPI } from '../../../shared/api/authAPI';

const PharmacistDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalMedicines: 0,
    pendingPrescriptions: 0,
    lowStockItems: 0,
    expiringMedicines: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      setUser(userData);

      const medicinesRes = await pharmacistAPI.getMedicines();
      const medicines = medicinesRes.data;
      const totalMedicines = medicines.length;
      const lowStockItems = medicines.filter(m => m.stock < 20).length;

      setStats({
        totalMedicines,
        pendingPrescriptions: 0,
        lowStockItems,
        expiringMedicines: 0,
      });
    } catch (error) {
      console.error('Error loading data:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('access_token');
      await authAPI.logout(token);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.clear();
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '18px', color: '#666' }}>
        Loading...
      </div>
    );
  }

  const cards = [
    { title: 'Total Medicines', value: stats.totalMedicines, color: '#3b82f6', bg: '#eff6ff' },
    { title: 'Pending Prescriptions', value: stats.pendingPrescriptions, color: '#f59e0b', bg: '#fffbeb' },
    { title: 'Low Stock Items', value: stats.lowStockItems, color: '#ef4444', bg: '#fef2f2' },
    { title: 'Expiring Medicines', value: stats.expiringMedicines, color: '#f97316', bg: '#fff7ed' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <div style={{ background: 'white', padding: '20px 30px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 5px 0', color: '#1e293b' }}>
              Pharmacist Dashboard
            </h1>
            <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
              Welcome, {user?.username}
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{ 
              padding: '10px 20px', 
              background: '#ef4444', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              fontWeight: '600', 
              fontSize: '14px' 
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        
        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          {cards.map((card, index) => (
            <div 
              key={index} 
              style={{ 
                background: card.bg, 
                borderRadius: '12px', 
                padding: '24px', 
                border: `2px solid ${card.color}20` 
              }}
            >
              <h3 style={{ fontSize: '14px', color: '#64748b', margin: '0 0 10px 0', fontWeight: '600' }}>
                {card.title}
              </h3>
              <p style={{ fontSize: '36px', fontWeight: 'bold', color: card.color, margin: 0 }}>
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#1e293b' }}>
            Quick Actions
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            
            <button 
              onClick={() => navigate('/pharmacist/medicines')}
              style={{ 
                padding: '16px', 
                background: '#3b82f6', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                fontWeight: '600', 
                fontSize: '14px',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              📦 View All Medicines
            </button>
            
            <button 
              onClick={() => navigate('/pharmacist/prescriptions')}
              style={{ 
                padding: '16px', 
                background: '#10b981', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                fontWeight: '600', 
                fontSize: '14px',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              📋 View Prescriptions
            </button>
            
            <button 
              style={{ 
                padding: '16px', 
                background: '#f59e0b', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                fontWeight: '600', 
                fontSize: '14px',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              ⚠️ Check Low Stock
            </button>
            
            <button 
              style={{ 
                padding: '16px', 
                background: '#8b5cf6', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                fontWeight: '600', 
                fontSize: '14px',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              💊 Medicine Billing
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacistDashboard;
