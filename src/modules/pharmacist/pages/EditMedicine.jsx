import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import { Oval } from 'react-loader-spinner';
import PharmacistLayout from '../components/PharmacistLayout';
import { getMedicine, updateMedicine } from '../../../shared/api/pharmacistAPI';

const schema = yup.object().shape({
  name: yup.string().required('Medicine name is required'),
  generic_name: yup.string(),
  manufacturer: yup.string(),
  unit: yup.string().required('Unit is required'),
  unit_price: yup.number().positive('Price must be positive').required('Price is required'),
  stock_quantity: yup.number().min(0, 'Stock cannot be negative').required('Stock quantity is required'),
  reorder_level: yup.number().min(0, 'Reorder level cannot be negative').required('Reorder level is required'),
  expiry_date: yup.date().nullable(),
  description: yup.string(),
});

const EditMedicine = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    fetchMedicine();
  }, [id]);

  const fetchMedicine = async () => {
    try {
      setLoading(true);
      const data = await getMedicine(id);
      
      // Populate form fields
      setValue('name', data.name);
      setValue('generic_name', data.generic_name || '');
      setValue('manufacturer', data.manufacturer || '');
      setValue('unit', data.unit);
      setValue('unit_price', data.unit_price);
      setValue('stock_quantity', data.stock_quantity);
      setValue('reorder_level', data.reorder_level);
      setValue('expiry_date', data.expiry_date || '');
      setValue('description', data.description || '');
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load medicine details');
      navigate('/pharmacist/medicines');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      await updateMedicine(id, data);
      toast.success('Medicine updated successfully!');
      navigate('/pharmacist/medicines');
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update medicine');
    }
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
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/pharmacist/medicines')}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Edit Medicine</h1>
            <p className="text-gray-600 mt-1">Update medicine details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Generic Name</label>
              <input {...register('generic_name')} type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Manufacturer</label>
              <input {...register('manufacturer')} type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

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
              {errors.unit && <p className="mt-1 text-sm text-red-600">{errors.unit.message}</p>}
            </div>

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
              />
              {errors.unit_price && <p className="mt-1 text-sm text-red-600">{errors.unit_price.message}</p>}
            </div>

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
              />
              {errors.stock_quantity && <p className="mt-1 text-sm text-red-600">{errors.stock_quantity.message}</p>}
            </div>

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
              />
              {errors.reorder_level && <p className="mt-1 text-sm text-red-600">{errors.reorder_level.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
              <input {...register('expiry_date')} type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea {...register('description')} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button type="button" onClick={() => navigate('/pharmacist/medicines')} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors" disabled={isSubmitting}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center px-6 py-2 rounded-lg text-white transition-colors ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isSubmitting ? (
                <>
                  <Oval height={20} width={20} color="#ffffff" secondaryColor="#93c5fd" />
                  <span className="ml-2">Updating...</span>
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Update Medicine
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </PharmacistLayout>
  );
};

export default EditMedicine;
