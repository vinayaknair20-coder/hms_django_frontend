import React, { useState } from 'react';
import { searchMedicines, createQuickSale } from '../../../shared/api/pharmacistAPI';
import Modal from '../../../shared/components/common/Modal';
import './QuickSale.css';

const QuickSale = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [showBill, setShowBill] = useState(false);
  const [billData, setBillData] = useState(null);

  // Search medicines
  const handleSearch = async () => {
    if (searchQuery.trim().length < 2) {
      alert('Please enter at least 2 characters to search');
      return;
    }

    setSearching(true);
    try {
      const results = await searchMedicines(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      alert('Failed to search medicines');
    } finally {
      setSearching(false);
    }
  };

  // Add to cart
  const addToCart = (medicine) => {
    const existing = cart.find(item => item.id === medicine.id);
    if (existing) {
      alert('Medicine already in cart!');
      return;
    }
    setCart([...cart, { ...medicine, quantity: 1 }]);
    setSearchResults([]);
    setSearchQuery('');
  };

  // Update quantity
  const updateQuantity = (medicineId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const medicine = cart.find(item => item.id === medicineId);
    if (newQuantity > medicine.stock) {
      alert(`Only ${medicine.stock} units available in stock`);
      return;
    }

    setCart(cart.map(item =>
      item.id === medicineId ? { ...item, quantity: parseInt(newQuantity) } : item
    ));
  };

  // Remove from cart
  const removeFromCart = (medicineId) => {
    setCart(cart.filter(item => item.id !== medicineId));
  };

  // Calculate total
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price_per_unit * item.quantity), 0);
  };

  // Process sale
  const handleProcessSale = async () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }

    if (!customerName.trim()) {
      alert('Please enter customer name');
      return;
    }

    setLoading(true);
    try {
      const saleData = {
        customer_name: customerName,
        customer_phone: customerPhone,
        medicines: cart.map(item => ({
          medicine_id: item.id,
          quantity: item.quantity
        }))
      };

      const response = await createQuickSale(saleData);
      setBillData(response);
      setShowBill(true);
      
      // Clear form
      setCart([]);
      setCustomerName('');
      setCustomerPhone('');
    } catch (error) {
      console.error('Sale error:', error);
      alert(error.response?.data?.error || 'Failed to process sale');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quick-sale-container">
      <h1>Quick Sale (Walk-in)</h1>

      <div className="sale-layout">
        {/* LEFT: Medicine Search */}
        <div className="search-section">
          <h2>Search Medicines</h2>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by medicine name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} disabled={searching}>
              {searching ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map(medicine => (
                <div key={medicine.id} className="medicine-result">
                  <div className="medicine-info">
                    <h4>{medicine.name}</h4>
                    <p>Stock: {medicine.stock} | Price: ₹{medicine.price_per_unit}</p>
                  </div>
                  <button onClick={() => addToCart(medicine)}>Add to Cart</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Cart & Customer Info */}
        <div className="cart-section">
          <h2>Cart ({cart.length} items)</h2>

          {cart.length === 0 ? (
            <p className="empty-cart">Cart is empty. Search and add medicines.</p>
          ) : (
            <>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>₹{item.price_per_unit} × {item.quantity} = ₹{(item.price_per_unit * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="item-controls">
                      <input
                        type="number"
                        min="1"
                        max={item.stock}
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, e.target.value)}
                      />
                      <button onClick={() => removeFromCart(item.id)}>✕</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-total">
                <h3>Total: ₹{calculateTotal().toFixed(2)}</h3>
              </div>

              {/* Customer Info */}
              <div className="customer-info">
                <h3>Customer Details</h3>
                <input
                  type="text"
                  placeholder="Customer Name *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number (optional)"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>

              <button 
                className="process-sale-btn" 
                onClick={handleProcessSale}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Process Sale'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bill Modal */}
      {showBill && billData && (
        <Modal isOpen={showBill} onClose={() => setShowBill(false)}>
          <div className="bill-modal">
            <h2>Sale Receipt</h2>
            <div className="bill-header">
              <p><strong>Bill No:</strong> {billData.bill_number}</p>
              <p><strong>Date:</strong> {new Date(billData.date).toLocaleString()}</p>
              <p><strong>Customer:</strong> {billData.customer_name}</p>
              {billData.customer_phone && <p><strong>Phone:</strong> {billData.customer_phone}</p>}
            </div>

            <table className="bill-table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {billData.medicines.map((med, index) => (
                  <tr key={index}>
                    <td>{med.name}</td>
                    <td>{med.quantity}</td>
                    <td>₹{med.price.toFixed(2)}</td>
                    <td>₹{med.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="bill-total">
              <h3>Grand Total: ₹{billData.total_amount.toFixed(2)}</h3>
              <p className="payment-status">Payment Status: {billData.payment_status}</p>
            </div>

            <button onClick={() => window.print()}>Print Receipt</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default QuickSale;
