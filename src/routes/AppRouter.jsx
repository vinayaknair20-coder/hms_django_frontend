import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import Unauthorized from '../pages/Unauthorized';

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected Routes - Will be added later */}
      {/* Example:
      <Route 
        path="/admin/*" 
        element={
          <PrivateRoute allowedRoles={['ADMIN']}>
            <AdminModule />
          </PrivateRoute>
        } 
      />
      */}

      {/* 404 Not Found - Must be last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
