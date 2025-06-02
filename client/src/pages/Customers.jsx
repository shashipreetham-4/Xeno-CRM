import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({});

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

  const handleDelete = async (id) => {
    const res = await fetch(`/api/customers/${id}`, { method: 'DELETE' });
    if (res.ok) setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  const handleEdit = (customer) => {
    setEditing(customer.id);
    setEditData({ ...customer });
  };

  const handleSave = async () => {
    const res = await fetch(`/api/customers/${editing}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    });

    if (res.ok) {
      const updated = await res.json();
      setCustomers((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
      setEditing(null);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Customers</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Spent</th>
            <th>Last Order</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((cust) => (
            <tr key={cust.id} className="border-t">
              <td>
                {editing === cust.id ? (
                  <input
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                    className="border p-1 w-full"
                  />
                ) : (
                  cust.name
                )}
              </td>
              <td>{cust.email}</td>
              <td>{cust.phone}</td>
              <td>
                {editing === cust.id ? (
                  <input
                    type="number"
                    value={editData.total_spent}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        total_spent: parseFloat(e.target.value),
                      })
                    }
                    className="border p-1 w-24"
                  />
                ) : (
                  `₹${cust.total_spent}`
                )}
              </td>
              <td>{cust.last_order_date}</td>
              <td>
                {editing === cust.id ? (
                  <button onClick={handleSave} className="text-green-600">
                    Save
                  </button>
                ) : (
                  <button onClick={() => handleEdit(cust)} className="text-blue-600 mr-2">
                    Edit
                  </button>
                )}
                <button onClick={() => handleDelete(cust.id)} className="text-red-600">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Customers;
