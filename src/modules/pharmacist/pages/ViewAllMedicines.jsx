import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPills, FaEdit, FaTrash, FaPlus, FaSearch, FaExclamationTriangle, FaFilter } from 'react-icons/fa';
import * as pharmacistAPI from '../../../shared/api/pharmacistAPI';

const ViewAllMedicines = () => {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ show: false, medicine: null });

  // Fetch all medicines
  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const data = await pharmacistAPI.getAllMedicines();
      setMedicines(data);
      setFilteredMedicines(data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
      alert('Failed to fetch medicines');
    } finally {
      setLoading(false);
    }
  };

  // Search & Filter Logic
  useEffect(() => {
    let result = medicines;

    // Search filter
    if (searchQuery) {
      result = result.filter(med =>
        med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (med.generic_name && med.generic_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (med.category && med.category.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Low stock filter
    if (filterLowStock) {
      result = result.filter(med => med.stock < 10);
    }

    setFilteredMedicines(result);
  }, [searchQuery, filterLowStock, medicines]);

  // Delete Medicine
  const handleDelete = async (id) => {
    try {
      await pharmacistAPI.deleteMedicine(id);
      alert('Medicine deleted successfully!');
      fetchMedicines(); // Refresh list
      setDeleteModal({ show: false, medicine: null });
    } catch (error) {
      console.error('Error deleting medicine:', error);
      alert('Failed to delete medicine');
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loader}>Loading medicines...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <FaPills style={styles.headerIcon} />
          <div>
            <h1 style={styles.headerTitle}>Medicine Inventory</h1>
            <p style={styles.headerSubtitle}>Manage all medicines in stock</p>
          </div>
        </div>
        <button onClick={() => navigate('/pharmacist/add-medicine')} style={styles.addButton}>
          <FaPlus style={{marginRight: '8px'}} />
          Add New Medicine
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div style={styles.searchSection}>
        <div style={styles.searchBox}>
          <FaSearch style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by name, generic name, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <button
          onClick={() => setFilterLowStock(!filterLowStock)}
          style={{
            ...styles.filterButton,
            ...(filterLowStock ? styles.filterButtonActive : {})
          }}
        >
          <FaFilter style={{marginRight: '8px'}} />
          {filterLowStock ? 'Show All' : 'Low Stock Only'}
        </button>
      </div>

      {/* Stats Summary */}
      <div style={styles.statsBar}>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>Total Medicines:</span>
          <span style={styles.statValue}>{medicines.length}</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>Showing:</span>
          <span style={styles.statValue}>{filteredMedicines.length}</span>
        </div>
        <div style={styles.statItem}>
          <span style={{...styles.statLabel, color: '#ef4444'}}>Low Stock:</span>
          <span style={{...styles.statValue, color: '#ef4444'}}>
            {medicines.filter(m => m.stock < 10).length}
          </span>
        </div>
      </div>

      {/* Medicines Table */}
      {filteredMedicines.length > 0 ? (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Medicine Name</th>
                <th style={styles.th}>Generic Name</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Stock</th>
                <th style={styles.th}>Price (₹)</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedicines.map((medicine) => (
                <tr key={medicine.id} style={styles.tableRow}>
                  <td style={styles.td}>{medicine.id}</td>
                  <td style={styles.td}>
                    <div style={styles.medicineName}>
                      <FaPills style={styles.medicineIcon} />
                      {medicine.name}
                    </div>
                  </td>
                  <td style={styles.td}>{medicine.generic_name || '-'}</td>
                  <td style={styles.td}>
                    <span style={styles.categoryBadge}>
                      {medicine.category || 'General'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.stockBadge,
                      ...(medicine.stock < 10 ? styles.stockLow : styles.stockGood)
                    }}>
                      {medicine.stock} units
                    </span>
                  </td>
                  <td style={styles.td}>₹{parseFloat(medicine.price_per_unit).toFixed(2)}</td>
                  <td style={styles.td}>
                    {medicine.stock < 10 ? (
                      <span style={styles.statusLow}>
                        <FaExclamationTriangle /> Low Stock
                      </span>
                    ) : (
                      <span style={styles.statusGood}>● In Stock</span>
                    )}
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actionButtons}>
                      <button
                        onClick={() => navigate(`/pharmacist/edit-medicine/${medicine.id}`)}
                        style={styles.editButton}
                        title="Edit Medicine"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => setDeleteModal({ show: true, medicine })}
                        style={styles.deleteButton}
                        title="Delete Medicine"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={styles.noData}>
          <FaPills style={styles.noDataIcon} />
          <p style={styles.noDataText}>
            {searchQuery || filterLowStock ? 'No medicines found matching your criteria' : 'No medicines in inventory'}
          </p>
          <button onClick={() => navigate('/pharmacist/add-medicine')} style={styles.addButton}>
            <FaPlus style={{marginRight: '8px'}} />
            Add First Medicine
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Confirm Delete</h2>
            <p style={styles.modalText}>
              Are you sure you want to delete <strong>{deleteModal.medicine?.name}</strong>?
              This action cannot be undone.
            </p>
            <div style={styles.modalButtons}>
              <button
                onClick={() => setDeleteModal({ show: false, medicine: null })}
                style={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteModal.medicine.id)}
                style={styles.confirmDeleteButton}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    padding: '2rem',
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    background: 'white',
    borderRadius: '16px',
    padding: '1.5rem 2rem',
    marginBottom: '1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  headerIcon: {
    fontSize: '2.5rem',
    color: '#667eea',
  },
  headerTitle: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: 0,
  },
  headerSubtitle: {
    fontSize: '0.9rem',
    color: '#6b7280',
    margin: 0,
  },
  addButton: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
    transition: 'all 0.3s ease',
  },
  searchSection: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  searchBox: {
    flex: 1,
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: '1.25rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
    fontSize: '1.1rem',
  },
  searchInput: {
    width: '100%',
    padding: '1rem 1rem 1rem 3.5rem',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '12px',
    background: 'white',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    outline: 'none',
  },
  filterButton: {
    padding: '1rem 1.5rem',
    background: 'white',
    color: '#667eea',
    border: '2px solid #667eea',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.3s ease',
  },
  filterButtonActive: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    border: 'none',
  },
  statsBar: {
    background: 'white',
    borderRadius: '12px',
    padding: '1rem 2rem',
    marginBottom: '1.5rem',
    display: 'flex',
    justifyContent: 'space-around',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#6b7280',
    fontWeight: '500',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#667eea',
  },
  tableContainer: {
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeaderRow: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
  },
  th: {
    padding: '1.25rem 1rem',
    textAlign: 'left',
    color: 'white',
    fontWeight: '600',
    fontSize: '0.95rem',
  },
  tableRow: {
    borderBottom: '1px solid #f3f4f6',
    transition: 'background 0.2s ease',
  },
  td: {
    padding: '1.25rem 1rem',
    fontSize: '0.95rem',
    color: '#374151',
  },
  medicineName: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: '600',
  },
  medicineIcon: {
    color: '#667eea',
  },
  categoryBadge: {
    padding: '0.35rem 0.75rem',
    background: '#e0e7ff',
    color: '#667eea',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  stockBadge: {
    padding: '0.35rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  stockLow: {
    background: '#fee2e2',
    color: '#dc2626',
  },
  stockGood: {
    background: '#d1fae5',
    color: '#065f46',
  },
  statusLow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    color: '#dc2626',
    fontWeight: '600',
    fontSize: '0.85rem',
  },
  statusGood: {
    color: '#10b981',
    fontWeight: '600',
    fontSize: '0.85rem',
  },
  actionButtons: {
    display: 'flex',
    gap: '0.5rem',
  },
  editButton: {
    padding: '0.5rem 0.75rem',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
  },
  deleteButton: {
    padding: '0.5rem 0.75rem',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
  },
  noData: {
    background: 'white',
    borderRadius: '16px',
    padding: '4rem 2rem',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  noDataIcon: {
    fontSize: '4rem',
    color: '#d1d5db',
    marginBottom: '1rem',
  },
  noDataText: {
    fontSize: '1.1rem',
    color: '#6b7280',
    marginBottom: '1.5rem',
  },
  loader: {
    textAlign: 'center',
    fontSize: '1.5rem',
    color: 'white',
    fontWeight: '600',
    padding: '4rem',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    background: 'white',
    borderRadius: '16px',
    padding: '2rem',
    maxWidth: '500px',
    width: '90%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '1rem',
  },
  modalText: {
    fontSize: '1rem',
    color: '#6b7280',
    marginBottom: '2rem',
  },
  modalButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    padding: '0.75rem 1.5rem',
    background: '#e5e7eb',
    color: '#374151',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
  },
  confirmDeleteButton: {
    padding: '0.75rem 1.5rem',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
  },
};

export default ViewAllMedicines;
