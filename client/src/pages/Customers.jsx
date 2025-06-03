import { useEffect, useState } from "react";
//import Papa from "papaparse";
import { supabase } from "../lib/supabaseClient";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [userId, setUserId] = useState(null);

  const fetchCustomers = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const res = await fetch(`/api/customers/${user.id}`);
  const result = await res.json();

  if (res.ok) setCustomers(result);
  else alert("❌ Failed to fetch customers");
};

  useEffect(() => {
    fetchCustomers();

    const getUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };

    getUserId();
  }, []);

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  // const handleUpload = async () => {
  //   if (!csvFile) return alert("Please upload a CSV");
  //   if (!userId) return alert("User not logged in");

  //   Papa.parse(csvFile, {
  //     header: true,
  //     skipEmptyLines: true,
  //     complete: async (results) => {
  //       const rows = results.data;

  //       const res = await fetch("/api/customers/bulk", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ customers: rows, user_id: userId }),
  //       });

  //       const response = await res.json();
  //       if (res.ok) {
  //         alert("✅ Customers uploaded successfully");
  //         fetchCustomers();
  //       } else {
  //         alert("❌ Error: " + (response.error || "Failed to upload"));
  //       }
  //     },
  //   });
  // };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">

      <main className="flex-1 px-6 py-10 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">📋 Customer List</h1>

        <div className="mb-6 flex items-center gap-4">
          {/* <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="border rounded px-4 py-2 shadow-sm"
          /> */}
          {/* <button
            onClick={handleUpload}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Upload CSV
          </button> */}
        </div>

        <div className="overflow-x-auto rounded shadow">
          <table className="w-full text-left border-collapse bg-white">
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm tracking-wider">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Total Spent</th>
                <th className="px-6 py-3">Last Order</th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? (
                customers.map((cust) => (
                  <tr
                    key={cust.id}
                    className="hover:bg-blue-50 transition border-b"
                  >
                    <td className="px-6 py-4 font-medium">{cust.name}</td>
                    <td className="px-6 py-4">{cust.email}</td>
                    <td className="px-6 py-4">{cust.phone || "-"}</td>
                    <td className="px-6 py-4">₹{cust.total_spent || 0}</td>
                    <td className="px-6 py-4">
                      {cust.last_order_date
                        ? new Date(cust.last_order_date).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-6 py-4" colSpan="5">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Customers;
