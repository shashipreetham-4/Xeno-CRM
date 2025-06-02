import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

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
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Add New Customer</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required className="w-full p-2 text-black border border-gray-300 rounded" />
        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full p-2 text-black border border-gray-300 rounded" />
        <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border text-black border-gray-300 rounded" />
        <input name="total_spent" placeholder="Total Spent" type="number" value={formData.total_spent} onChange={handleChange} className="w-full p-2 border text-black border-gray-300 rounded" />
        <input name="last_order_date" placeholder="Last Order Date" type="date" value={formData.last_order_date} onChange={handleChange} className="w-full p-2 text-black border border-gray-300 rounded" />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Customer
        </button>
      </form>
    </div>
  );
};

export default AddCustomer;
