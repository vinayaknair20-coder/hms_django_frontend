import React, { useState, useEffect } from 'react';
import { FaHistory, FaFilter } from 'react-icons/fa';
import { Oval } from 'react-loader-spinner';
import toast from 'react-hot-toast';
import PharmacistLayout from '../components/PharmacistLayout';
import { getStockHistory } from '../../../shared/api/pharmacistAPI';

const StockHistory = () => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    filterHistory();
  }, [filterType, history]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getStockHistory();
      setHistory(data);
      setFilteredHistory(data);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to load stock history');
    } finally {
      setLoading(false);
    }
  };

  const filterHistory = () => {
    if (filterType === 'all') {
      setFilteredHistory(history);
    } else {
      const filtered = history.filter((item) => item.transaction_type === filterType);
      setFilteredHistory(filtered);
    }
  };

  const getTransactionBadge = (type) => {
    const badges = {
      restock: 'bg-green-100 text-green-800',
      dispense: 'bg-blue-100 text-blue-800',
      adjustment: 'bg-orange-100 text-orange-800',
      return: 'bg-purple-100 text-purple-800',
    };
    return badges[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <PharmacistLayout>
        <div className="flex justify-center items-center h-96">
          <Oval height={60} width={60} color="#3b82f6" secondaryColor="#93c5fd" />
        </div>
      </PharmacistLayout>
    );
  }

  return (
    <PharmacistLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Stock History</h1>
          <p className="text-gray-600 mt-1">Track all inventory transactions</p>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-4">
            <FaFilter className="text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Transactions</option>
              <option value="restock">Restock</option>
              <option value="dispense">Dispense</option>
              <option value="adjustment">Adjustment</option>
              <option value="return">Return</option>
            </select>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredHistory.length} of {history.length} transactions
          </div>
        </div>

        {/* History Table */}
        {filteredHistory.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaHistory className="mx-auto text-gray-400 text-5xl mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Transactions Found</h3>
            <p className="text-gray-500">No stock history available for the selected filter</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medicine</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.medicine_name || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTransactionBadge(item.transaction_type)}`}>
                          {item.transaction_type || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.quantity_change > 0 ? '+' : ''}{item.quantity_change}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PharmacistLayout>
  );
};

export default StockHistory;
