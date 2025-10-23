import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaPills, FaClipboardList, FaHistory, FaSignOutAlt, FaHome, FaUser } from 'react-icons/fa';
import toast from 'react-hot-toast';

const PharmacistLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully!');
    navigate('/');
  };

  const navItems = [
    { path: '/pharmacist/dashboard', icon: FaHome, label: 'Dashboard' },
    { path: '/pharmacist/medicines', icon: FaPills, label: 'Medicines' },
    { path: '/pharmacist/prescriptions', icon: FaClipboardList, label: 'Prescriptions' },
    { path: '/pharmacist/stock-history', icon: FaHistory, label: 'Stock History' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo & Nav Links */}
            <div className="flex space-x-8">
              <div className="flex items-center">
                <FaPills className="text-blue-600 text-2xl mr-2" />
                <span className="text-xl font-bold text-gray-800">Pharmacist Portal</span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex space-x-4 items-center">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="mr-2" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-700">
                <FaUser className="mr-2" />
                <span className="font-medium">{user.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200">
          <div className="flex justify-around py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center px-3 py-2 ${
                    isActive ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  <Icon className="text-xl" />
                  <span className="text-xs mt-1">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default PharmacistLayout;
