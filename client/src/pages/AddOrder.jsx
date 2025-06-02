import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AddOrder = () => {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    customer_id: '',
    amount: '',
    order_date: '',
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const res = await fetch(`/api/customers/${user.id}`);
      const data = await res.json();
      setCustomers(data);
    };

    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('✅ Order added!');
        setFormData({ customer_id: '', amount: '', order_date: '' });
      } else {
        alert('❌ Failed to add order');
      }
    } catch (err) {
      console.error(err);
      alert('❌ Error occurred');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Add Order</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="customer_id"
          value={formData.customer_id}
          onChange={handleChange}
          className="w-full text-black p-2 border border-gray-300 rounded"
        >
          <option value="">Select Customer</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.email})
            </option>
          ))}
        </select>

        <input
          name="amount"
          type="number"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          className="w-full p-2 border text-black border-gray-300 rounded"
        />

        <input
          name="order_date"
          type="date"
          value={formData.order_date}
          onChange={handleChange}
          className="w-full p-2 border text-black border-gray-300 rounded"
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Order
        </button>
      </form>
    </div>
  );
};

export default AddOrder;
