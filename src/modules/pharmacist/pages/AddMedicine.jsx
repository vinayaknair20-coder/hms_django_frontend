// src/modules/pharmacist/pages/AddMedicine.jsx
import React, { useState } from 'react';
import { addMedicine } from '../../../shared/api/pharmacistAPI';

const AddMedicine = () => {
  const [formData, setFormData] = useState({
    name: '',
    generic_name: '',
    category: '',
    manufacturer: '',
    description: '',
    stock: 0,
    price_per_unit: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await addMedicine(formData);
      alert('Medicine added successfully!');
      // Reset form or redirect
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-medicine-container">
      <h2>Add New Medicine</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        {/* Your form fields here */}
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Medicine'}
        </button>
      </form>
    </div>
  );
};

export default AddMedicine;
