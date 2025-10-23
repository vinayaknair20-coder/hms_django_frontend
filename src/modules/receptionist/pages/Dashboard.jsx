import React, { useState } from 'react';
import { useAuth } from '../../../shared/context/AuthContext';
import { Calendar, Users, FileText, DollarSign, UserPlus, Clock } from 'lucide-react';

const ReceptionistDashboard = () => {
  const { user, logout } = useAuth(); // ✅ Get user from AuthContext
  const [stats] = useState({
    todayAppointments: 24,
    pendingCheckIns: 8,
    totalPatients: 342,
    pendingBills: 12
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Receptionist Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome, {user?.username}</p> {/* ✅ Use user.username */}
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-3xl font-bold text-blue-600">{stats.todayAppointments}</p>
              </div>
              <Calendar className="h-12 w-12 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Check-Ins</p>
                <p className="text-3xl font-bold text-orange-600">{stats.pendingCheckIns}</p>
              </div>
              <Clock className="h-12 w-12 text-orange-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-3xl font-bold text-green-600">{stats.totalPatients}</p>
              </div>
              <Users className="h-12 w-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Bills</p>
                <p className="text-3xl font-bold text-purple-600">{stats.pendingBills}</p>
              </div>
              <DollarSign className="h-12 w-12 text-purple-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center gap-2 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition">
              <UserPlus className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-600">Register New Patient</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition">
              <Calendar className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-600">Book Appointment</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg hover:bg-purple-100 transition">
              <FileText className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-purple-600">Generate Bill</span>
            </button>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Appointments</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">09:00 AM</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">John Doe</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Dr. Smith</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:text-blue-900">Check-In</button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">10:00 AM</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Jane Smith</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Dr. Johnson</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Checked-In
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-purple-600 hover:text-purple-900">Generate Bill</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReceptionistDashboard;
