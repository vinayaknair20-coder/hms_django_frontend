import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import { Oval } from 'react-loader-spinner';
import PharmacistLayout from '../components/PharmacistLayout';
import { addMedicine } from '../../../shared/api/pharmacistAPI';

// Validation Schema
const schema = yup.object().shape({
  name: yup.string().required('Medicine name is required'),
  generic_name: yup.string(),
  manufacturer: yup.string(),
  unit: yup.string().required('Unit is required'),
  unit_price: yup.number().positive('Price must be positive').required('Price is required'),
  stock_quantity: yup.number().min(0, 'Stock cannot be negative').required('Stock quantity is required'),
  reorder_level: yup.number().min(0, 'Reorder level cannot be negative').required('Reorder level is required'),
  expiry_date: yup.date().min(new Date(), 'Expiry date must be in the future'),
  description: yup.string(),
});

const AddMedicine = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await addMedicine(data);
      toast.success('Medicine added successfully!');
      navigate('/pharmacist/medicines');
    } catch (error) {
      console.error('Add medicine error:', error);
      toast.error(error.response?.data?.message || 'Failed to add medicine');
    }
  };

  return (
    <PharmacistLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/pharmacist/medicines')}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Add New Medicine</h1>
            <p className="text-gray-600 mt-1">Fill in the details below</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Medicine Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medicine Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register('name')}
                type="text"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Enter medicine name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Generic Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Generic Name
              </label>
              <input
                {...register('generic_name')}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter generic name"
              />
            </div>

            {/* Manufacturer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Manufacturer
              </label>
              <input
                {...register('manufacturer')}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter manufacturer name"
              />
            </div>

            {/* Unit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit <span className="text-red-500">*</span>
              </label>
              <select
                {...register('unit')}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.unit ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              >
                <option value="">Select unit</option>
                <option value="tablets">Tablets</option>
                <option value="capsules">Capsules</option>
                <option value="ml">ML</option>
                <option value="bottles">Bottles</option>
                <option value="syrup">Syrup</option>
                <option value="injection">Injection</option>
              </select>
              {errors.unit && (
                <p className="mt-1 text-sm text-red-600">{errors.unit.message}</p>
              )}
            </div>

            {/* Unit Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                {...register('unit_price')}
                type="number"
                step="0.01"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.unit_price ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Enter price"
              />
              {errors.unit_price && (
                <p className="mt-1 text-sm text-red-600">{errors.unit_price.message}</p>
              )}
            </div>

            {/* Stock Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                {...register('stock_quantity')}
                type="number"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.stock_quantity ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Enter quantity"
              />
              {errors.stock_quantity && (
                <p className="mt-1 text-sm text-red-600">{errors.stock_quantity.message}</p>
              )}
            </div>

            {/* Reorder Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reorder Level <span className="text-red-500">*</span>
              </label>
              <input
                {...register('reorder_level')}
                type="number"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.reorder_level ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Enter reorder level"
              />
              {errors.reorder_level && (
                <p className="mt-1 text-sm text-red-600">{errors.reorder_level.message}</p>
              )}
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>
              <input
                {...register('expiry_date')}
                type="date"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.expiry_date ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.expiry_date && (
                <p className="mt-1 text-sm text-red-600">{errors.expiry_date.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter medicine description"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/pharmacist/medicines')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center px-6 py-2 rounded-lg text-white transition-colors ${
                isSubmitting
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Oval height={20} width={20} color="#ffffff" secondaryColor="#93c5fd" />
                  <span className="ml-2">Adding...</span>
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Add Medicine
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </PharmacistLayout>
  );
};

export default AddMedicine;
