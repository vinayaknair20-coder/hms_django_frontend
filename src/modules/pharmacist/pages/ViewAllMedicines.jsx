// src/modules/pharmacist/pages/ViewAllMedicines.jsx
import React, { useState, useEffect } from 'react';
import { getMedicines, deleteMedicine, searchMedicines } from '../../../shared/api/pharmacistAPI';
import { useNavigate } from 'react-router-dom';
import './ViewAllMedicines.css';

const ViewAllMedicines = () => {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch medicines on component mount
  useEffect(() => {
    fetchMedicines();
  }, []);

  // Filter medicines when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMedicines(medicines);
    } else {
      const filtered = medicines.filter(medicine =>
        medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (medicine.generic_name && medicine.generic_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (medicine.category && medicine.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredMedicines(filtered);
    }
    setCurrentPage(1); // Reset to first page when searching
  }, [searchTerm, medicines]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMedicines();
      setMedicines(data);
      setFilteredMedicines(data);
    } catch (err) {
      setError('Failed to load medicines. Please try again.');
      console.error('Error fetching medicines:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteMedicine(id);
        alert('Medicine deleted successfully!');
        fetchMedicines(); // Refresh list
      } catch (err) {
        alert('Failed to delete medicine. Please try again.');
        console.error('Error deleting medicine:', err);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/pharmacist/edit-medicine/${id}`);
  };

  const handleAddNew = () => {
    navigate('/pharmacist/add-medicine');
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMedicines = filteredMedicines.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMedicines.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading medicines...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchMedicines}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="view-medicines-container">
      {/* Header Section */}
      <div className="medicines-header">
        <h1>Medicine Inventory</h1>
        <button className="add-medicine-btn" onClick={handleAddNew}>
          + Add New Medicine
        </button>
      </div>

      {/* Search and Stats Section */}
      <div className="search-stats-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, generic name, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="inventory-stats">
          <span className="stat-badge">Total: {filteredMedicines.length}</span>
          <span className="stat-badge low-stock">
            Low Stock: {filteredMedicines.filter(m => m.stock < 20).length}
          </span>
        </div>
      </div>

      {/* Medicines Table */}
      <div className="table-container">
        {currentMedicines.length === 0 ? (
          <div className="no-data">
            <p>No medicines found</p>
          </div>
        ) : (
          <table className="medicines-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Generic Name</th>
                <th>Category</th>
                <th>Manufacturer</th>
                <th>Stock</th>
                <th>Price (₹)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentMedicines.map((medicine) => (
                <tr key={medicine.id} className={medicine.stock < 20 ? 'low-stock-row' : ''}>
                  <td>{medicine.id}</td>
                  <td className="medicine-name">{medicine.name}</td>
                  <td>{medicine.generic_name || '-'}</td>
                  <td>
                    <span className="category-badge">{medicine.category || '-'}</span>
                  </td>
                  <td>{medicine.manufacturer || '-'}</td>
                  <td>
                    <span className={`stock-badge ${medicine.stock < 20 ? 'low' : 'normal'}`}>
                      {medicine.stock}
                    </span>
                  </td>
                  <td>₹{parseFloat(medicine.price_per_unit).toFixed(2)}</td>
                  <td className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(medicine.id)}
                      title="Edit Medicine"
                    >
                      ✏️
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(medicine.id, medicine.name)}
                      title="Delete Medicine"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          
          <div className="page-numbers">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}

      {/* Summary Footer */}
      <div className="table-footer">
        <p>
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredMedicines.length)} of {filteredMedicines.length} medicines
        </p>
      </div>
    </div>
  );
};

export default ViewAllMedicines;
