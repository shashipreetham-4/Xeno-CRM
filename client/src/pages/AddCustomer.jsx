import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AddCustomer = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    total_spent: '',
    last_order_date: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert('Not logged in');
      return;
    }

    const payload = {
      user_id: user.id,
      ...formData,
    };

    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert('✅ Customer added!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          total_spent: '',
          last_order_date: '',
        });
      } else {
        console.error('Add failed:', data.error);
        alert('❌ Failed to add customer');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('❌ Error occurred');
    }
  };

  return (
    <>

      <div className="pt-24 px-6 max-w-xl mx-auto">
        <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-blue-800 mb-6">👤 Add New Customer</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 border text-black border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 border text-black border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                name="phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border text-black border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Spent</label>
              <input
                name="total_spent"
                type="number"
                placeholder="1000"
                value={formData.total_spent}
                onChange={handleChange}
                className="w-full p-2 border text-black border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Order Date</label>
              <input
                name="last_order_date"
                type="date"
                value={formData.last_order_date}
                onChange={handleChange}
                className="w-full p-2 border text-black border-gray-300 rounded"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full transition-colors duration-200"
            >
              Add Customer
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AddCustomer;
