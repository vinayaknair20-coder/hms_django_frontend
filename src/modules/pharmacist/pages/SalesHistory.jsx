import React, { useState, useEffect } from 'react';
import { getSalesHistory } from '../../../shared/api/pharmacistAPI';
import Loader from '../../../shared/components/common/Loader';
import Modal from '../../../shared/components/common/Modal';
import './SalesHistory.css';

const SalesHistory = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [customerFilter, setCustomerFilter] = useState('');
  const [stats, setStats] = useState({
    count: 0,
    total_revenue: 0
  });

  useEffect(() => {
    fetchSalesHistory();
  }, []);

  const fetchSalesHistory = async (appliedFilters = {}) => {
    setLoading(true);
    try {
      const data = await getSalesHistory(appliedFilters);
      setSales(data.sales || []);
      setStats({
        count: data.count || 0,
        total_revenue: data.total_revenue || 0
      });
    } catch (error) {
      console.error('Error fetching sales:', error);
      alert('Failed to load sales history');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const appliedFilters = {};
    if (customerFilter) appliedFilters.customer = customerFilter;
    fetchSalesHistory(appliedFilters);
  };

  const clearFilters = () => {
    setCustomerFilter('');
    fetchSalesHistory();
  };

  const viewDetails = (sale) => {
    setSelectedSale(sale);
    setShowDetails(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="sales-history-container">
      <h1>Sales History</h1>

      {/* Stats Summary */}
      <div className="stats-summary">
        <div className="stat-card">
          <h3>Total Sales</h3>
          <p className="stat-value">{stats.count}</p>
        </div>
        <div className="stat-card revenue">
          <h3>Total Revenue</h3>
          <p className="stat-value">₹{stats.total_revenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Filter - Customer Name Only */}
      <div className="filters-section">
        <h2>Filter Sales</h2>
        <div className="filters-grid-simple">
          <input
            type="text"
            name="customer"
            placeholder="Customer Name"
            value={customerFilter}
            onChange={(e) => setCustomerFilter(e.target.value)}
          />
          <div className="filter-buttons">
            <button onClick={applyFilters} className="apply-btn">Apply</button>
            <button onClick={clearFilters} className="clear-btn">Clear</button>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="sales-table-section">
        <h2>Sales Records ({sales.length})</h2>
        {sales.length === 0 ? (
          <p className="no-sales">No sales found.</p>
        ) : (
          <table className="sales-table">
            <thead>
              <tr>
                <th>Bill No.</th>
                <th>Customer Name</th>
                <th>Phone</th>
                <th>Date & Time</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id}>
                  <td>{sale.bill_number}</td>
                  <td>{sale.customer_name}</td>
                  <td>{sale.customer_phone}</td>
                  <td>{formatDate(sale.date)}</td>
                  <td>{sale.items_count}</td>
                  <td>₹{sale.total_amount.toFixed(2)}</td>
                  <td>
                    <button onClick={() => viewDetails(sale)} className="view-btn">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Details Modal */}
      {showDetails && selectedSale && (
        <Modal isOpen={showDetails} onClose={() => setShowDetails(false)}>
          <div className="sale-details-modal">
            <h2>Sale Details</h2>
            
            <div className="sale-header">
              <div className="detail-row">
                <strong>Bill Number:</strong>
                <span>{selectedSale.bill_number}</span>
              </div>
              <div className="detail-row">
                <strong>Customer:</strong>
                <span>{selectedSale.customer_name}</span>
              </div>
              <div className="detail-row">
                <strong>Phone:</strong>
                <span>{selectedSale.customer_phone}</span>
              </div>
              <div className="detail-row">
                <strong>Date:</strong>
                <span>{formatDate(selectedSale.date)}</span>
              </div>
              <div className="detail-row">
                <strong>Created By:</strong>
                <span>{selectedSale.created_by}</span>
              </div>
            </div>

            <h3>Items Purchased</h3>
            <table className="items-table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedSale.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.medicine_name}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.price.toFixed(2)}</td>
                    <td>₹{item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="sale-total">
              <h3>Grand Total: ₹{selectedSale.total_amount.toFixed(2)}</h3>
            </div>

            <button onClick={() => window.print()} className="print-btn">
              Print Receipt
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SalesHistory;
