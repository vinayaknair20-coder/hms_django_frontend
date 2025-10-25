import React, { useState, useEffect } from 'react';
import { getBillings, createBilling } from '../../../shared/api/pharmacistAPI';
import { useNavigate } from 'react-router-dom';

const GenerateBill = () => {
  const [billingItems, setBillingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBillingItems = async () => {
      try {
        setLoading(true);
        const data = await getBillings();
        setBillingItems(data);
        setError(null);
      } catch {
        setError('Failed to load billing data.');
      } finally {
        setLoading(false);
      }
    };
    fetchBillingItems();
  }, []);

  const totalAmount = billingItems.reduce((sum, item) => sum + item.amount, 0);

  const handlePayment = async () => {
    if (!amountPaid || Number(amountPaid) < totalAmount) {
      setPaymentError('Amount paid is insufficient.');
      return;
    }
    try {
      await createBilling({
        items: billingItems,
        total: totalAmount,
        paid: Number(amountPaid),
      });
      alert('Bill generated successfully!');
      navigate('/pharmacist');
    } catch {
      setPaymentError('Failed to generate bill, please try again.');
    }
  };

  if (loading) return <div>Loading billing details...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="billing-container">
      <h2>Generate Bill</h2>
      <table>
        <thead>
          <tr>
            <th>Medicine</th>
            <th>Quantity</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {billingItems.map(item => (
            <tr key={item.medicine_id}>
              <td>{item.medicine_name}</td>
              <td>{item.quantity}</td>
              <td>₹{item.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Total Amount: ₹{totalAmount.toFixed(2)}</h3>
      <label>Amount Paid:</label>
      <input
        type="number"
        min={totalAmount}
        value={amountPaid}
        onChange={e => setAmountPaid(e.target.value)}
      />
      {paymentError && <div className="error">{paymentError}</div>}
      <button onClick={handlePayment}>Generate Bill</button>
    </div>
  );
};

export default GenerateBill;
