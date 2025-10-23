import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../shared/context/AuthContext';
import { Users, UserPlus, Edit2, Trash2, Search, X } from 'lucide-react';
import API_BASE_URL from '../../../shared/api/config';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  
  const [staff, setStaff] = useState([]);
  const [stats, setStats] = useState({
    totalStaff: 0,
    admins: 0,
    doctors: 0,
    receptionists: 0,
    pharmacists: 0
  });
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'Doctor',
    is_active: true
  });

  // Fetch all staff
  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/users/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      const data = await response.json();
      setStaff(data);
      calculateStats(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching staff:', error);
      setLoading(false);
    }
  };

  const calculateStats = (staffData) => {
    setStats({
      totalStaff: staffData.length,
      admins: staffData.filter(s => s.role === 'Admin').length,
      doctors: staffData.filter(s => s.role === 'Doctor').length,
      receptionists: staffData.filter(s => s.role === 'Receptionist').length,
      pharmacists: staffData.filter(s => s.role === 'Pharmacist').length
    });
  };

  // Create staff
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        alert('Staff created successfully!');
        setShowModal(false);
        resetForm();
        fetchStaff();
      } else {
        const error = await response.json();
        alert(`Error: ${JSON.stringify(error)}`);
      }
    } catch (error) {
      console.error('Error creating staff:', error);
      alert('Failed to create staff');
    }
  };

  // Update staff
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password; // Don't send password if empty
      }
      
      const response = await fetch(`${API_BASE_URL}/admin/users/${selectedStaff.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(updateData)
      });
      
      if (response.ok) {
        alert('Staff updated successfully!');
        setShowModal(false);
        resetForm();
        fetchStaff();
      } else {
        const error = await response.json();
        alert(`Error: ${JSON.stringify(error)}`);
      }
    } catch (error) {
      console.error('Error updating staff:', error);
      alert('Failed to update staff');
    }
  };

  // Delete staff
  const handleDelete = async (staffId) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${staffId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      if (response.ok || response.status === 204) {
        alert('Staff deleted successfully!');
        fetchStaff();
      } else {
        alert('Failed to delete staff');
      }
    } catch (error) {
      console.error('Error deleting staff:', error);
      alert('Failed to delete staff');
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (staffMember) => {
    setModalMode('edit');
    setSelectedStaff(staffMember);
    setFormData({
      username: staffMember.username,
      role: staffMember.role,
      is_active: staffMember.is_active,
      password: '' // Don't pre-fill password
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      role: 'Doctor',
      is_active: true
    });
    setSelectedStaff(null);
  };

  const filteredStaff = staff.filter(s => 
    s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeStyle = (role) => {
    const styles = {
      'Admin': { backgroundColor: '#E9D5FF', color: '#7C3AED' },
      'Doctor': { backgroundColor: '#DBEAFE', color: '#2563EB' },
      'Receptionist': { backgroundColor: '#D1FAE5', color: '#059669' },
      'Pharmacist': { backgroundColor: '#FEF3C7', color: '#D97706' }
    };
    return styles[role] || { backgroundColor: '#F3F4F6', color: '#6B7280' };
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <header style={{ 
        backgroundColor: 'white', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                🏥 Admin Dashboard
              </h1>
              <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: '0.25rem 0 0 0' }}>
                Welcome, <strong>{user?.username}</strong>
              </p>
            </div>
            <button
              onClick={logout}
              style={{
                padding: '0.5rem 1.5rem',
                backgroundColor: '#DC2626',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#B91C1C'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#DC2626'}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <StatCard title="Total Staff" value={stats.totalStaff} color="#7C3AED" icon="👥" />
          <StatCard title="Admins" value={stats.admins} color="#7C3AED" icon="👑" />
          <StatCard title="Doctors" value={stats.doctors} color="#2563EB" icon="👨‍⚕️" />
          <StatCard title="Receptionists" value={stats.receptionists} color="#059669" icon="📋" />
          <StatCard title="Pharmacists" value={stats.pharmacists} color="#D97706" icon="💊" />
        </div>

        {/* Staff Management Section */}
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
              Staff Management
            </h2>
            <button
              onClick={openCreateModal}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1.25rem',
                backgroundColor: '#2563EB',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#1D4ED8'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#2563EB'}
            >
              <UserPlus size={18} />
              Add New Staff
            </button>
          </div>

          {/* Search Bar */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ position: 'relative' }}>
              <Search style={{ 
                position: 'absolute', 
                left: '0.75rem', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: '#9CA3AF'
              }} size={20} />
              <input
                type="text"
                placeholder="Search by username or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.625rem 0.75rem 0.625rem 2.5rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
              />
            </div>
          </div>

          {/* Staff Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#F9FAFB', borderBottom: '2px solid #E5E7EB' }}>
                <tr>
                  <th style={tableHeaderStyle}>Username</th>
                  <th style={tableHeaderStyle}>Role</th>
                  <th style={tableHeaderStyle}>Status</th>
                  <th style={tableHeaderStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#6B7280' }}>
                      {loading ? 'Loading...' : 'No staff members found'}
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map((staffMember) => (
                    <tr key={staffMember.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                      <td style={tableCellStyle}>
                        <strong>{staffMember.username}</strong>
                      </td>
                      <td style={tableCellStyle}>
                        <span style={{
                          ...getRoleBadgeStyle(staffMember.role),
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          {staffMember.role}
                        </span>
                      </td>
                      <td style={tableCellStyle}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          backgroundColor: staffMember.is_active ? '#D1FAE5' : '#FEE2E2',
                          color: staffMember.is_active ? '#059669' : '#DC2626'
                        }}>
                          {staffMember.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ ...tableCellStyle, display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => openEditModal(staffMember)}
                          style={{ ...actionButtonStyle, color: '#2563EB' }}
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(staffMember.id)}
                          style={{ ...actionButtonStyle, color: '#DC2626' }}
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                {modalMode === 'create' ? '➕ Add New Staff' : '✏️ Edit Staff'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ ...actionButtonStyle, color: '#6B7280' }}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={modalMode === 'create' ? handleCreate : handleUpdate}>
              <FormInput 
                label="Username *" 
                value={formData.username} 
                onChange={(e) => setFormData({...formData, username: e.target.value})} 
                required 
              />
              
              <FormInput 
                label={modalMode === 'create' ? "Password *" : "Password (leave blank to keep current)"} 
                type="password" 
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                required={modalMode === 'create'}
                autoComplete="new-password"
              />

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  style={inputStyle}
                  required
                >
                  <option value="Admin">Admin</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Receptionist">Receptionist</option>
                  <option value="Pharmacist">Pharmacist</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  style={{ marginRight: '0.5rem', width: '1rem', height: '1rem', cursor: 'pointer' }}
                />
                <label style={{ fontSize: '0.875rem', color: '#374151' }}>Active</label>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    ...submitButtonStyle,
                    backgroundColor: 'white',
                    color: '#374151',
                    border: '1px solid #D1D5DB'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    ...submitButtonStyle,
                    backgroundColor: '#2563EB',
                    color: 'white'
                  }}
                >
                  {modalMode === 'create' ? 'Create' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components
const StatCard = ({ title, value, color, icon }) => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    padding: '1.5rem',
    borderLeft: `4px solid ${color}`,
    transition: 'transform 0.2s',
    cursor: 'pointer'
  }}
  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6B7280', margin: '0 0 0.5rem 0' }}>
          {title}
        </p>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', color, margin: 0 }}>
          {value}
        </p>
      </div>
      <div style={{ fontSize: '2.5rem', opacity: 0.3 }}>{icon}</div>
    </div>
  </div>
);

const FormInput = ({ label, type = "text", value, onChange, required = false, autoComplete }) => (
  <div style={{ marginBottom: '1rem' }}>
    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      autoComplete={autoComplete}
      style={inputStyle}
    />
  </div>
);

// Styles
const tableHeaderStyle = {
  padding: '0.75rem 1rem',
  textAlign: 'left',
  fontSize: '0.75rem',
  fontWeight: '600',
  color: '#6B7280',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const tableCellStyle = {
  padding: '1rem',
  fontSize: '0.875rem',
  color: '#374151'
};

const actionButtonStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '0.25rem',
  transition: 'all 0.2s'
};

const inputStyle = {
  width: '100%',
  padding: '0.5rem 0.75rem',
  border: '1px solid #D1D5DB',
  borderRadius: '0.375rem',
  fontSize: '0.875rem',
  outline: 'none',
  transition: 'border-color 0.2s'
};

const submitButtonStyle = {
  flex: 1,
  padding: '0.625rem 1rem',
  borderRadius: '0.375rem',
  fontWeight: '600',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s'
};

export default AdminDashboard;
