import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPendingPrescriptions, dispensePrescription } from '../../../shared/api/pharmacistAPI';

const DispenseMedicine = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dispenseQty, setDispenseQty] = useState({});
  const [dispensing, setDispensing] = useState(false);

  useEffect(() => {
    const fetchPrescription = async () => {
      setLoading(true);
      try {
        const prescriptions = await getPendingPrescriptions();
        const selected = prescriptions.find(p => p.id.toString() === id);
        if (!selected) {
          setError('Prescription not found');
        } else {
          setPrescription(selected);
          const initialQtys = {};
          selected.medicines.forEach(m => {
            initialQtys[m.id] = 0;
          });
          setDispenseQty(initialQtys);
        }
      } catch {
        setError('Failed to load prescription');
      }
      setLoading(false);
    };
    fetchPrescription();
  }, [id]);

  const handleQtyChange = (medId, val) => {
    if (!prescription) return;
    const qty = Math.max(0, Math.min(val, prescription.medicines.find(m => m.id === medId).prescribed_quantity));
    setDispenseQty(prev => ({ ...prev, [medId]: qty }));
  };

  const handleDispense = async () => {
    setDispensing(true);
    setError(null);
    try {
      await dispensePrescription(id, { medicines: dispenseQty });
      alert('Prescription dispensed!');
      navigate('/pharmacist/prescriptions');
    } catch {
      setError('Failed to dispense prescription');
    }
    setDispensing(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!prescription) return null;

  return (
    <div className="dispense-container">
      <h2>Dispense Prescription #{prescription.id}</h2>
      <h3>Patient: {prescription.patient_name}</h3>
      <h3>Doctor: {prescription.doctor_name}</h3>
      <table>
        <thead>
          <tr>
            <th>Medicine</th>
            <th>Prescribed Quantity</th>
            <th>Dispense Quantity</th>
          </tr>
        </thead>
        <tbody>
          {prescription.medicines.map(med => (
            <tr key={med.id}>
              <td>{med.name}</td>
              <td>{med.prescribed_quantity}</td>
              <td>
                <input
                  type="number"
                  min={0}
                  max={med.prescribed_quantity}
                  value={dispenseQty[med.id]}
                  onChange={e => handleQtyChange(med.id, Number(e.target.value))}
                  disabled={dispensing}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleDispense} disabled={dispensing}>
        {dispensing ? 'Dispensing...' : 'Dispense'}
      </button>
    </div>
  );
};

export default DispenseMedicine;
