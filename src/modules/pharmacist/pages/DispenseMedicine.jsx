import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import { Oval } from 'react-loader-spinner';
import PharmacistLayout from '../components/PharmacistLayout';
import axiosInstance from '../../../shared/utils/axiosInstance';

const DispenseMedicine = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [prescription, setPrescription] = useState(null);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    fetchPrescription();
  }, [id]);

  const fetchPrescription = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/pharmacist/prescriptions/${id}/`);
      setPrescription(response.data);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load prescription details');
      navigate('/pharmacist/prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      await axiosInstance.post(`/api/pharmacist/prescriptions/${id}/dispense/`, data);
      toast.success('Prescription dispensed successfully!');
      navigate('/pharmacist/prescriptions');
    } catch (error) {
      console.error('Dispense error:', error);
      toast.error(error.response?.data?.message || 'Failed to dispense prescription');
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
          <button onClick={() => navigate('/pharmacist/prescriptions')} className="text-gray-600 hover:text-gray-800 transition-colors">
            <FaArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dispense Prescription</h1>
            <p className="text-gray-600 mt-1">Prescription #{prescription?.id}</p>
          </div>
        </div>

        {/* Prescription Details */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Prescription Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Patient Name</p>
              <p className="font-medium text-gray-900">{prescription?.patient_name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600">Doctor</p>
              <p className="font-medium text-gray-900">{prescription?.doctor_name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600">Date Prescribed</p>
              <p className="font-medium text-gray-900">
                {prescription?.created_at ? new Date(prescription.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Status</p>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                {prescription?.status || 'Pending'}
              </span>
            </div>
          </div>

          {prescription?.medicines && prescription.medicines.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-3">Prescribed Medicines</h3>
              <div className="space-y-2">
                {prescription.medicines.map((med, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{med.name}</p>
                      <p className="text-sm text-gray-600">{med.dosage}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">Qty: {med.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dispense Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Dispense Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                {...register('notes')}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter any additional notes or instructions..."
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/pharmacist/prescriptions')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center px-6 py-2 rounded-lg text-white transition-colors ${
                isSubmitting ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Oval height={20} width={20} color="#ffffff" secondaryColor="#a7f3d0" />
                  <span className="ml-2">Dispensing...</span>
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Complete Dispense
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </PharmacistLayout>
  );
};

export default DispenseMedicine;
