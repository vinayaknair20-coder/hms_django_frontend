import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import PharmacistDashboard from '../modules/pharmacist/pages/Dashboard';
import ViewAllPrescriptions from '../modules/pharmacist/pages/ViewAllPrescriptions';
import Unauthorized from '../pages/Unauthorized';
import NotFound from '../pages/NotFound';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/pharmacist/dashboard" element={<PharmacistDashboard />} />
      <Route path="/pharmacist/prescriptions" element={<ViewAllPrescriptions />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
