import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../../shared/context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  LogOut,
  Menu,
  X,
  ChevronDown,
  UserPlus,
  Search,
  Eye
} from 'lucide-react';

const ReceptionistLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  const toggleSubmenu = (menu) => {
    setOpenSubmenu(openSubmenu === menu ? null : menu);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/receptionist',
      exact: true
    },
    {
      title: 'Patients',
      icon: Users,
      submenu: [
        { title: 'View All Patients', path: '/receptionist/view-patients', icon: Eye },
        { title: 'Add New Patient', path: '/receptionist/add-patient', icon: UserPlus },
        { title: 'Search Patient', path: '/receptionist/search-patient', icon: Search }
      ]
    },
    {
      title: 'Appointments',
      icon: Calendar,
      submenu: [
        { title: 'View Appointments', path: '/receptionist/view-appointments', icon: Eye },
        { title: 'Book Appointment', path: '/receptionist/book-appointment', icon: UserPlus }
      ]
    },
    {
      title: 'Billing',
      icon: FileText,
      submenu: [
        { title: 'View Bills', path: '/receptionist/view-bills', icon: Eye },
        { title: 'Generate Bill', path: '/receptionist/billing', icon: FileText }
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white shadow-lg transition-all duration-300 ease-in-out flex flex-col`}
      >
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {isSidebarOpen && (
            <h1 className="text-lg font-bold text-green-700">Life Care Hospital</h1>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.title}>
                {item.path ? (
                  // Single Link - Always Green
                  <NavLink
                    to={item.path}
                    end={item.exact}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                        isActive
                          ? 'bg-green-600 text-white font-medium shadow-md'
                          : 'text-green-600 hover:bg-green-100 font-medium'
                      }`
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    {isSidebarOpen && <span>{item.title}</span>}
                  </NavLink>
                ) : (
                  // Submenu - Always Green
                  <>
                    <button
                      onClick={() => toggleSubmenu(item.title)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-green-600 hover:bg-green-100 font-medium transition"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        {isSidebarOpen && <span>{item.title}</span>}
                      </div>
                      {isSidebarOpen && (
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            openSubmenu === item.title ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </button>

                    {/* Submenu Items - Always Green */}
                    {isSidebarOpen && openSubmenu === item.title && (
                      <ul className="ml-8 mt-2 space-y-1">
                        {item.submenu.map((subitem) => (
                          <li key={subitem.path}>
                            <NavLink
                              to={subitem.path}
                              className={({ isActive }) =>
                                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                                  isActive
                                    ? 'bg-green-600 text-white font-medium shadow-md'
                                    : 'text-green-600 hover:bg-green-100 font-medium'
                                }`
                              }
                            >
                              <subitem.icon className="h-4 w-4" />
                              {subitem.title}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-gray-200 p-4">
          {isSidebarOpen && (
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-800">
                {user?.first_name || user?.username || 'Receptionist'}
              </p>
              <p className="text-xs text-gray-500">{user?.role || 'Receptionist'}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 font-medium transition"
          >
            <LogOut className="h-5 w-5" />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default ReceptionistLayout;
