import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ViewAllMedicines = () => {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://127.0.0.1:8000/api/pharmacist/medicines/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMedicines(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load medicines');
      setLoading(false);
    }
  };

  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.generic_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', fontSize: '18px', color: '#666' }}>Loading medicines...</div>;
  }

  if (error) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#c33' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '30px', background: '#f5f7fa', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px', color: '#1e293b' }}>
            Medicine Inventory
          </h1>
          <p style={{ color: '#64748b', marginBottom: '20px' }}>Total: {medicines.length} medicines</p>
          
          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            <button
              onClick={() => navigate('/pharmacist/dashboard')}
              style={{ padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
            >
              ← Back to Dashboard
            </button>
            
            <input
              type="text"
              placeholder="Search medicines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1, padding: '10px 15px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '14px' }}
            />
          </div>
        </div>

        {filteredMedicines.length === 0 ? (
          <div style={{ background: 'white', padding: '40px', textAlign: 'center', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#999' }}>No medicines found</p>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', fontSize: '14px', color: '#475569' }}>Name</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', fontSize: '14px', color: '#475569' }}>Generic Name</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', fontSize: '14px', color: '#475569' }}>Category</th>
                    <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600', fontSize: '14px', color: '#475569' }}>Stock</th>
                    <th style={{ padding: '15px', textAlign: 'right', fontWeight: '600', fontSize: '14px', color: '#475569' }}>Price</th>
                    <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600', fontSize: '14px', color: '#475569' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedicines.map((med, index) => {
                    const stockStatus = med.stock < 20 ? 'low' : med.stock < 50 ? 'medium' : 'good';
                    const statusColor = stockStatus === 'low' ? '#ef4444' : stockStatus === 'medium' ? '#f59e0b' : '#10b981';
                    
                    return (
                      <tr key={med.id} style={{ borderBottom: '1px solid #f1f5f9', background: index % 2 === 0 ? 'white' : '#fafafa' }}>
                        <td style={{ padding: '15px', fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>{med.name}</td>
                        <td style={{ padding: '15px', fontSize: '14px', color: '#64748b' }}>{med.generic_name || 'N/A'}</td>
                        <td style={{ padding: '15px', fontSize: '14px', color: '#64748b' }}>{med.category || 'N/A'}</td>
                        <td style={{ padding: '15px', fontSize: '14px', textAlign: 'center', fontWeight: '600', color: statusColor }}>
                          {med.stock}
                        </td>
                        <td style={{ padding: '15px', fontSize: '14px', textAlign: 'right', fontWeight: '500', color: '#1e293b' }}>
                          ₹{med.price?.toFixed(2)}
                        </td>
                        <td style={{ padding: '15px', textAlign: 'center' }}>
                          <span style={{ 
                            padding: '4px 12px', 
                            borderRadius: '12px', 
                            fontSize: '12px', 
                            fontWeight: '600',
                            background: stockStatus === 'low' ? '#fee2e2' : stockStatus === 'medium' ? '#fef3c7' : '#d1fae5',
                            color: statusColor
                          }}>
                            {stockStatus === 'low' ? 'Low Stock' : stockStatus === 'medium' ? 'Medium' : 'In Stock'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAllMedicines;
