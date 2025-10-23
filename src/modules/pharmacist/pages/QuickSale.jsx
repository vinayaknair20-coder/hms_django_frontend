import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllMedicines, createBilling } from '../../../shared/api/pharmacistAPI';

const QuickSale = () => {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await getAllMedicines();
      setMedicines(response.data.medicines || []);
      setLoading(false);
    } catch (error) {
      toast.error('❌ Failed to load medicines');
      setLoading(false);
    }
  };

  const addToCart = (medicine) => {
    const existingItem = cart.find(item => item.id === medicine.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === medicine.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...medicine, quantity: 1 }]);
    }
    toast.success(`✅ ${medicine.name} added to cart`);
  };

  const removeFromCart = (medicineId) => {
    setCart(cart.filter(item => item.id !== medicineId));
    toast.info('🗑️ Item removed from cart');
  };

  const updateQuantity = (medicineId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(medicineId);
      return;
    }

    setCart(cart.map(item =>
      item.id === medicineId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price_per_unit * item.quantity), 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('❌ Cart is empty');
      return;
    }

    try {
      const billData = {
        items: cart.map(item => ({
          medicine_id: item.id,
          quantity: item.quantity,
          price: item.price_per_unit
        }))
      };

      await createBilling(billData);
      toast.success('✅ Sale completed successfully!');
      setCart([]);
      fetchMedicines();
    } catch (error) {
      toast.error(`❌ Error: ${error.response?.data?.detail || 'Failed to complete sale'}`);
    }
  };

  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Quick Sale</h2>
          <button
            onClick={() => navigate('/pharmacist/dashboard')}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Medicines List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search medicines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">
                {filteredMedicines.map((medicine) => (
                  <div
                    key={medicine.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <h3 className="font-semibold text-gray-800 mb-2">{medicine.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{medicine.description || 'No description'}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-teal-600">
                        ₹{parseFloat(medicine.price_per_unit).toFixed(2)}
                      </span>
                      <span className={`px-2 py-1 rounded text-sm ${
                        medicine.stock < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        Stock: {medicine.stock}
                      </span>
                    </div>
                    <button
                      onClick={() => addToCart(medicine)}
                      disabled={medicine.stock === 0}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {medicine.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cart */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Cart</h3>
              
              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p>Cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-4 max-h-[400px] overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-800 text-sm">{item.name}</h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                          <span className="font-bold text-teal-600">
                            ₹{(item.price_per_unit * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 mb-4">
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Total:</span>
                      <span className="text-teal-600">₹{getTotalAmount().toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition"
                  >
                    Complete Sale
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickSale;
