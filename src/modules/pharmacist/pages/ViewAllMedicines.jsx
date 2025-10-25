import React, { useState, useEffect } from 'react';
import { getMedicines, deleteMedicine } from '../../../shared/api/pharmacistAPI';
import { useNavigate, Link } from 'react-router-dom';
import './ViewAllMedicines.css';

const ViewAllMedicines = () => {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMedicines();
      setMedicines(data);
    } catch {
      setError('Failed to load medicines. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteMedicine(id);
        fetchMedicines();
      } catch {
        alert('Failed to delete medicine.');
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/pharmacist/edit-medicine/${id}`);
  };

  const handleAddNew = () => {
    navigate('/pharmacist/add-medicine');
  };

  const filteredMedicines = medicines.filter((medicine) => 
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (medicine.generic_name && medicine.generic_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (medicine.category && medicine.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMedicines = filteredMedicines.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMedicines.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 6) {
      for (let i=1; i<=totalPages; i++) pageNumbers.push(i);
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1, '...', totalPages-3, totalPages-2, totalPages-1, totalPages);
      } else {
        pageNumbers.push(1, '...', currentPage-1, currentPage, currentPage+1, '...', totalPages);
      }
    }
    return pageNumbers;
  };

  if (loading) return <div className="loading">Loading medicines...</div>;
  if (error) return <div className="error">{error} <button onClick={fetchMedicines}>Retry</button></div>;

  return (
    <div className="view-medicines-container">
      <div className="inventory-toolbar">
        <h1>Medicine Inventory</h1>
        <div className="toolbar-actions">
          <Link to="/pharmacist" className="dashboard-btn">🏠 Dashboard</Link>
          <button className="add-medicine-btn" onClick={handleAddNew}>+ Add Medicine</button>
        </div>
      </div>
      <div className="filters-row">
        <input 
          className="search-input"
          placeholder="Search by name, category..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          autoFocus
        />
        <div className="right-badges">
          <span className="stat-badge">Total: {filteredMedicines.length}</span>
          <span className="stat-badge low-stock">Low Stock: {filteredMedicines.filter(m=>m.stock<20).length}</span>
        </div>
      </div>
      <div className="table-container">
        {currentMedicines.length === 0 ? (
          <div className="no-data">No medicines found</div>
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
              {currentMedicines.map(med => (
                <tr key={med.id} className={med.stock === 0 ? 'critical-stock-row' : med.stock < 20 ? 'low-stock-row' : ''}>
                  <td>{med.id}</td>
                  <td className="medicine-name">{med.name || <span className="empty-cell">N/A</span>}</td>
                  <td>{med.generic_name || <span className="empty-cell">N/A</span>}</td>
                  <td>{med.category ? <span className="category-badge">{med.category}</span> : <span className="empty-cell">N/A</span>}</td>
                  <td>{med.manufacturer || <span className="empty-cell">N/A</span>}</td>
                  <td>
                    <span className={`stock-badge ${med.stock === 0 ? 'critical' : med.stock < 20 ? 'low' : 'normal'}`}>
                      {med.stock}
                    </span>
                  </td>
                  <td>₹{Number(med.price_per_unit).toFixed(2)}</td>
                  <td className="action-buttons">
                    <button className="edit-btn" title="Edit Medicine" onClick={() => handleEdit(med.id)}>✏️</button>
                    <button className="delete-btn" title="Delete Medicine" onClick={() => handleDelete(med.id, med.name)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => paginate(1)} disabled={currentPage === 1} className="pagination-btn" aria-label="First page">&laquo;</button>
          <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="pagination-btn" aria-label="Previous page">Prev</button>
          {getPageNumbers().map((num,i) =>
            typeof num === 'number' ? (
              <button key={num} onClick={() => paginate(num)} className={`page-btn${currentPage === num ? ' active' : ''}`}>{num}</button>
            ) : (
              <span key={i} className="ellipsis">…</span>
            )
          )}
          <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="pagination-btn" aria-label="Next page">Next</button>
          <button onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} className="pagination-btn" aria-label="Last page">&raquo;</button>
        </div>
      )}
      <div className="table-footer">
        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredMedicines.length)} of {filteredMedicines.length} medicines
      </div>
    </div>
  );
};

export default ViewAllMedicines;
