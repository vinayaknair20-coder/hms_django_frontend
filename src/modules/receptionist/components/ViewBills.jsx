import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Eye, CreditCard, Calendar, User, DollarSign, Printer } from 'lucide-react';
import { billingAPI } from '../../../shared/api/receptionistAPI';

const ViewBills = () => {
  const navigate = useNavigate();
  
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchBills();
  }, []);

  useEffect(() => {
    filterBills();
  }, [searchQuery, statusFilter, bills]);

  const fetchBills = async () => {
    try {
      setIsLoading(true);
      const billsData = await billingAPI.getAllBills();
      console.log('✅ Bills fetched:', billsData);
      
      // Filter to show only bills where payment is completed (has token)
      const completedBills = billsData.filter(bill => 
        bill.Token && bill.Token.trim() !== ''
      );
      
      console.log(`✅ Completed transactions: ${completedBills.length} out of ${billsData.length}`);
      
      setBills(completedBills);
      setFilteredBills(completedBills);
    } catch (error) {
      console.error('❌ Error fetching bills:', error);
      alert('Failed to load bills. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const filterBills = () => {
    let filtered = [...bills];

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(bill => bill.payment_status === statusFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      const term = searchQuery.toLowerCase();
      filtered = filtered.filter(bill =>
        bill.patient_name?.toLowerCase().includes(term) ||
        bill.Token?.toLowerCase().includes(term) ||
        bill.id.toString().includes(term)
      );
    }

    setFilteredBills(filtered);
  };

  const handleViewReceipt = (billId) => {
    navigate('/receptionist/payment-success', { state: { billId } });
  };

  const handlePrintReceipt = (bill) => {
    window.print();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bills...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
        <p className="text-gray-600 mt-1">View all completed transactions and payment receipts</p>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by patient name, token, or ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="All">All Payments</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredBills.length} of {bills.length} completed transactions
        </div>
      </div>

      {/* Bills Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {filteredBills.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No bills found</p>
            <p className="text-gray-400 text-sm">
              {searchQuery ? 'Try adjusting your search' : 'Completed transactions will appear here'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Bill ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Token</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase">Amount</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-semibold">
                        BILL-{String(bill.id).padStart(4, '0')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-mono font-medium text-gray-900">
                          {bill.Token || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {bill.patient_name || 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formatDate(bill.Billing_date)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-bold text-gray-900">
                          ₹{parseFloat(bill.Amount || 0).toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(bill.payment_status)}`}>
                        {bill.payment_status || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleViewReceipt(bill.id)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2 text-sm font-medium"
                        >
                          <Eye className="h-4 w-4" />
                          View Receipt
                        </button>
                        <button
                          onClick={() => handlePrintReceipt(bill)}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition flex items-center gap-2 text-sm font-medium"
                        >
                          <Printer className="h-4 w-4" />
                          Print
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      {bills.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <h3 className="text-sm font-semibold text-gray-600">Total Bills</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{bills.length}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="h-6 w-6 text-green-600" />
              <h3 className="text-sm font-semibold text-gray-600">Total Revenue</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ₹{bills.reduce((sum, bill) => sum + parseFloat(bill.Amount || 0), 0).toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard className="h-6 w-6 text-purple-600" />
              <h3 className="text-sm font-semibold text-gray-600">Paid Bills</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {bills.filter(b => b.payment_status?.toLowerCase() === 'paid').length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewBills;
