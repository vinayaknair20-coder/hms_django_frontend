// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './modules/pharmacist/pages/Dashboard';
import ViewAllMedicines from './pages/ViewAllMedicines';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pharmacist/dashboard" element={<Dashboard />} />
        <Route path="/pharmacist/medicines" element={<ViewAllMedicines />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
