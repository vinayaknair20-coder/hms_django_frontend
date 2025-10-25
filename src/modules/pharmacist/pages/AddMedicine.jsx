import React, { useState } from 'react';
import { addMedicine } from '../../../shared/api/pharmacistAPI';
import { useNavigate } from 'react-router-dom';
import './AddMedicine.css';

const initialForm = {
  name: '',
  generic_name: '',
  category: '',
  manufacturer: '',
  description: '',
  stock: 0,
  price_per_unit: ""
};

const AddMedicine = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "stock" ? Number(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    if (!form.name.trim() || !form.price_per_unit) {
      setError('Name and price are required.');
      setLoading(false);
      return;
    }
    try {
      await addMedicine(form);
      setSuccess(true);
      setForm(initialForm);
      setTimeout(() => navigate('/pharmacist/medicines'), 1200);
    } catch {
      setError('Failed to add medicine. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-medicine-page">
      <div className="add-medicine-header">
        <h2>Add New Medicine</h2>
        <div>
          <button className="dashboard-btn" onClick={() => navigate('/pharmacist/dashboard')}>🏠 Dashboard</button>
          <button className="back-btn" onClick={() => navigate('/pharmacist/medicines')}>← Back</button>
        </div>
      </div>
      <form className="add-medicine-form" onSubmit={handleSubmit}>
        <div className="form-group half">
          <label>Name *</label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="form-group half">
          <label>Generic Name</label>
          <input name="generic_name" value={form.generic_name} onChange={handleChange} />
        </div>
        <div className="form-group half">
          <label>Category</label>
          <input name="category" value={form.category} onChange={handleChange} />
        </div>
        <div className="form-group half">
          <label>Manufacturer</label>
          <input name="manufacturer" value={form.manufacturer} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} />
        </div>
        <div className="form-group half">
          <label>Stock</label>
          <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} />
        </div>
        <div className="form-group half">
          <label>Price per Unit (₹) *</label>
          <input
            name="price_per_unit"
            type="number"
            min="0.01"
            step="0.01"
            value={form.price_per_unit}
            onChange={handleChange}
            required
          />
        </div>
        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">Medicine added successfully!</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Medicine'}
        </button>
      </form>
    </div>
  );
};

export default AddMedicine;
