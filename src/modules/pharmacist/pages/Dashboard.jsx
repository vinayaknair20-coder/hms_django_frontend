// src/modules/pharmacist/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pharmacistAPI } from '../../../shared/api/pharmacistAPI';
import './PharmacistDashboard.css';

const PharmacistDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    pendingPrescriptions: 0,
    lowStockItems: 0,
    todayDispensed: 0,
    totalInventory: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await pharmacistAPI.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Dashboard error:', err);
        setError('Failed to load dashboard data. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pharmacist-container">
      <header className="dashboard-header">
        <h1>Pharmacist Dashboard</h1>
        <div className="user-info">
          <span>Welcome, Pharmacist</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon pending">📋</div>
          <div className="stat-content">
            <h3>{stats.pendingPrescriptions}</h3>
            <p>Pending Prescriptions</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon warning">⚠️</div>
          <div className="stat-content">
            <h3>{stats.lowStockItems}</h3>
            <p>Low Stock Alerts</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success">✓</div>
          <div className="stat-content">
            <h3>{stats.todayDispensed}</h3>
            <p>Dispensed Today</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon inventory">📦</div>
          <div className="stat-content">
            <h3>{stats.totalInventory}</h3>
            <p>Total Items</p>
          </div>
        </div>
      </div>

      {/* ✅ NOW 4 BUTTONS - Added Sales History */}
      <div className="action-grid">
        <button
          className="action-btn"
          onClick={() => handleNavigation('/pharmacist/prescriptions')}
        >
          <span className="btn-icon">💊</span>
          <span className="btn-text">View Prescriptions</span>
        </button>

        <button
          className="action-btn"
          onClick={() => handleNavigation('/pharmacist/medicines')}
        >
          <span className="btn-icon">📊</span>
          <span className="btn-text">Manage Inventory</span>
        </button>

        <button
          className="action-btn"
          onClick={() => handleNavigation('/pharmacist/quick-sale')}
        >
          <span className="btn-icon">🛒</span>
          <span className="btn-text">Quick Sale</span>
        </button>

        <button
          className="action-btn"
          onClick={() => handleNavigation('/pharmacist/sales-history')}
        >
          <span className="btn-icon">📜</span>
          <span className="btn-text">Sales History</span>
        </button>
      </div>
    </div>
  );
};

export default PharmacistDashboard;
