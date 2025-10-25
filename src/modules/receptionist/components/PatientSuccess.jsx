import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Home, UserPlus, Eye } from 'lucide-react';

const PatientSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const patient = location.state?.patient;

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No patient data found</p>
          <button
            onClick={() => navigate('/receptionist')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Patient Registered Successfully!
          </h1>
          <p className="text-gray-600">
            Patient ID: #{patient.id}
          </p>
        </div>

        {/* Patient Details Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Patient Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium text-gray-900">{patient.Patient_name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Gender</p>
              <p className="font-medium text-gray-900">{patient.gender}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Date of Birth</p>
              <p className="font-medium text-gray-900">{patient.dob}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Blood Group</p>
              <p className="font-medium text-gray-900">{patient.blood_group}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Phone Number</p>
              <p className="font-medium text-gray-900">{patient.phone}</p>
            </div>

            {patient.emergency_contact && (
              <div>
                <p className="text-sm text-gray-600">Emergency Contact</p>
                <p className="font-medium text-gray-900">{patient.emergency_contact}</p>
              </div>
            )}

            <div className="md:col-span-2">
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-medium text-gray-900">{patient.address}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/receptionist')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            <Home className="h-5 w-5" />
            Go to Dashboard
          </button>

          <button
            onClick={() => navigate('/receptionist/add-patient')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <UserPlus className="h-5 w-5" />
            Register Another
          </button>

          <button
            onClick={() => navigate(`/receptionist/patient/${patient.id}`)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <Eye className="h-5 w-5" />
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientSuccess;
