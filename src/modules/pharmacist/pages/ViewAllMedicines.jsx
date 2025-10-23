import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaExclamationTriangle } from 'react-icons/fa';
import { Oval } from 'react-loader-spinner';
import toast from 'react-hot-toast';
import PharmacistLayout from '../components/PharmacistLayout';
import { getAllMedicines, deleteMedicine } from '../../../shared/api/pharmacistAPI';

const ViewAllMedicines = () => {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchMedicines();
  }, []);

  useEffect(() => {
    filterMedicines();
  }, [searchTerm, filterType, medicines]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const data = await getAllMedicines();
      setMedicines(data);
      setFilteredMedicines(data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
      toast.error('Failed to load medicines');
    } finally {
      setLoading(false);
    }
  };

  const filterMedicines = () => {
    let filtered = medicines;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((medicine) =>
        medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.generic_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Stock filter
    if (filterType === 'low_stock') {
      filtered = filtered.filter((medicine) => medicine.stock_quantity <= medicine.reorder_level);
    } else if (filterType === 'in_stock') {
      filtered = filtered.filter((medicine) => medicine.stock_quantity > medicine.reorder_level);
    } else if (filterType === 'out_of_stock') {
      filtered = filtered.filter((medicine) => medicine.stock_quantity === 0);
    }

    setFilteredMedicines(filtered);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      setDeleteLoading(id);
      await deleteMedicine(id);
      toast.success('Medicine deleted successfully!');
      fetchMedicines();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete medicine');
    } finally {
      setDeleteLoading(null);
    }
  };

  const getStockStatus = (medicine) => {
    if (medicine.stock_quantity === 0) {
      return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    } else if (medicine.stock_quantity <= medicine.reorder_level) {
      return { text: 'Low Stock', color: 'bg-orange-100 text-orange-800' };
    }
    return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
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
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">All Medicines</h1>
            <p className="text-gray-600 mt-1">Manage your pharmacy inventory</p>
          </div>
          <Link
            to="/pharmacist/medicines/add"
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="mr-2" />
            Add New Medicine
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by medicine name or generic name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Medicines</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredMedicines.length} of {medicines.length} medicines
          </div>
        </div>

        {/* Medicines Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredMedicines.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No medicines found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Medicine Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Generic Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMedicines.map((medicine) => {
                    const status = getStockStatus(medicine);
                    return (
                      <tr key={medicine.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {medicine.stock_quantity <= medicine.reorder_level && (
                              <FaExclamationTriangle className="text-orange-500 mr-2" />
                            )}
                            <span className="text-sm font-medium text-gray-900">
                              {medicine.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {medicine.generic_name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {medicine.stock_quantity} {medicine.unit}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          ₹{medicine.unit_price}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${status.color}`}>
                            {status.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => navigate(`/pharmacist/medicines/edit/${medicine.id}`)}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              title="Edit"
                            >
                              <FaEdit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(medicine.id, medicine.name)}
                              disabled={deleteLoading === medicine.id}
                              className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                              title="Delete"
                            >
                              {deleteLoading === medicine.id ? (
                                <Oval height={18} width={18} color="#dc2626" />
                              ) : (
                                <FaTrash size={18} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PharmacistLayout>
  );
};

export default ViewAllMedicines;
