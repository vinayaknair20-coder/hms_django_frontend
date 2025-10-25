import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Eye, Phone, Calendar, MapPin } from 'lucide-react';
import { patientAPI } from '../../../shared/api/receptionistAPI';

const SearchPatient = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [allPatients, setAllPatients] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // ✅ Fetch all patients on mount
  useEffect(() => {
    fetchAllPatients();
  }, []);

  const fetchAllPatients = async () => {
    try {
      setInitialLoading(true);
      const response = await patientAPI.getAll();
      setAllPatients(response.data || []);
    } catch (error) {
      console.error('❌ Error fetching patients:', error);
      alert('Failed to load patients');
    } finally {
      setInitialLoading(false);
    }
  };

  // ✅ Filter patients based on search term
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);

    // Search across multiple fields
    const term = searchTerm.toLowerCase().trim();
    const filtered = allPatients.filter(patient => 
      patient.Patient_name.toLowerCase().includes(term) ||
      patient.phone.includes(term) ||
      patient.id.toString().includes(term) ||
      (patient.blood_group && patient.blood_group.toLowerCase().includes(term))
    );

    setSearchResults(filtered);
    setLoading(false);
  };

  // ✅ Real-time search as user types
  useEffect(() => {
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      const filtered = allPatients.filter(patient => 
        patient.Patient_name.toLowerCase().includes(term) ||
        patient.phone.includes(term) ||
        patient.id.toString().includes(term) ||
        (patient.blood_group && patient.blood_group.toLowerCase().includes(term))
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, allPatients]);

  const handleViewDetails = (patientId) => {
    navigate(`/receptionist/patient/${patientId}`);
  };

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading patients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/receptionist')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">Search Patient</h1>
          <p className="text-gray-600 mt-1">
            Search by name, phone number, blood group, or patient ID ({allPatients.length} total patients)
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleSearch}>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter patient name, phone, blood group, or ID..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition font-medium"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Search Results */}
        {searchTerm.trim() ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Search Results ({searchResults.length})
            </h2>

            {searchResults.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-2">No patients found matching "{searchTerm}"</p>
                <p className="text-gray-400 text-sm">Try a different search term</p>
              </div>
            ) : (
              <div className="space-y-4">
                {searchResults.map((patient) => (
                  <div
                    key={patient.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-bold text-gray-900">
                            {patient.Patient_name}
                          </h3>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                            ID: #{patient.id}
                          </span>
                          {patient.blood_group && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                              {patient.blood_group}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="h-4 w-4" />
                            <span>{patient.phone}</span>
                          </div>

                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{patient.gender}, {calculateAge(patient.dob)} years</span>
                          </div>

                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate">{patient.address || 'No address'}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleViewDetails(patient.id)}
                        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Enter a search term to find patients</p>
            <p className="text-gray-400 text-sm mt-2">You can search by name, phone, blood group, or ID</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPatient;
