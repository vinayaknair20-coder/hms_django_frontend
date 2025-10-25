import React, { forwardRef } from 'react';
import './BillReceipt.css';

const BillReceipt = forwardRef(({ bill }, ref) => {
  console.log('🔍 Bill received:', bill);

  if (!bill || !bill.prescription) {
    return <div style={{ padding: '20px', color: 'red' }}>No bill data available</div>;
  }

  const { prescription, total_amount, bill_number, created_at } = bill;
  const meds = prescription.medicine_prescriptions || [];

  console.log('💊 Medicines:', meds);

  return (
    <div ref={ref} className="bill-receipt">
      <h2>🏥 Trinity Hospital</h2>
      <p><strong>Bill Number:</strong> {bill_number}</p>
      <p><strong>Date:</strong> {new Date(created_at).toLocaleString()}</p>
      <p><strong>Patient:</strong> {prescription.appointment?.patient?.user?.first_name || 'N/A'}</p>
      
      <h3>Medicines:</h3>
      {meds && meds.length > 0 ? (
        <ul>
          {meds.map((m, i) => (
            <li key={i}>
              <strong>{m.medicine?.name || 'N/A'}</strong> - 
              Qty: {m.quantity} - 
              ₹{(m.medicine?.price_per_unit || 0).toFixed(2)}
            </li>
          ))}
        </ul>
      ) : (
        <p>No medicines</p>
      )}
      
      <h3 style={{ marginTop: '20px', borderTop: '2px solid #333', paddingTop: '10px' }}>
        <strong>Total: ₹{(total_amount || 0).toFixed(2)}</strong>
      </h3>
      
      <p style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>
        Thank you for choosing Trinity Hospital
      </p>
    </div>
  );
});

BillReceipt.displayName = 'BillReceipt';
export default BillReceipt;
