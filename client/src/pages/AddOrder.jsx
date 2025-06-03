import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
    <>
      <div className="pt-24 px-6 max-w-xl mx-auto">
        <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-blue-800 mb-6">🛒 Add New Order</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
              <select
                name="customer_id"
                value={formData.customer_id}
                onChange={handleChange}
                className="w-full text-black p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Select Customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                name="amount"
                type="number"
                placeholder="Amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full p-2 border text-black border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order Date</label>
              <input
                name="order_date"
                type="date"
                value={formData.order_date}
                onChange={handleChange}
                className="w-full p-2 border text-black border-gray-300 rounded"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full transition-colors duration-200"
            >
              Add Order
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AddOrder;
