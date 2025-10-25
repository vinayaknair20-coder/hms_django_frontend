import React, { useState, useEffect } from 'react';
import { getMedicine, updateMedicine } from '../../../shared/api/pharmacistAPI';
import { useParams, useNavigate } from 'react-router-dom';
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

const EditMedicine = () => {
  const { id } = useParams();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setError('');
      setLoading(true);
      try {
        const data = await getMedicine(id);
        setForm({
          name: data.name || '',
          generic_name: data.generic_name || '',
          category: data.category || '',
          manufacturer: data.manufacturer || '',
          description: data.description || '',
          stock: data.stock ?? 0,
          price_per_unit: data.price_per_unit || ""
        });
      } catch {
        setError('Failed to load medicine. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

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
    setSaving(true);
    if (!form.name.trim() || !form.price_per_unit) {
      setError('Name and price are required.');
      setSaving(false);
      return;
    }
    try {
      await updateMedicine(id, form);
      setSuccess(true);
      setTimeout(() => navigate('/pharmacist/medicines'), 1100);
    } catch {
      setError('Failed to update medicine. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading medicine...</div>;

  return (
    <div className="add-medicine-page">
      <div className="add-medicine-header">
        <h2>Edit Medicine</h2>
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
          <input name="price_per_unit" type="number" min="0.01" step="0.01"
            value={form.price_per_unit} onChange={handleChange} required />
        </div>
        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">Medicine updated successfully!</div>}
        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditMedicine;
