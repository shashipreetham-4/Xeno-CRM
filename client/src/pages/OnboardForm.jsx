import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const OnboardForm = () => {
  const [form, setForm] = useState({ company_name: '', position: '' });
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data?.user?.id);

      const { data: userProfile } = await supabase
        .from('users')
        .select('company_name, position')
        .eq('id', data.user.id)
        .single();

      if (userProfile?.company_name && userProfile?.position) {
        navigate('/dashboard');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company_name || !form.position) return;

    await supabase.from('users').update(form).eq('id', userId);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Basic Navbar */}
      <nav className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <div className="text-lg font-bold text-blue-600">Xeno CRM</div>
        <div className="text-sm text-gray-600">Getting Started</div>
      </nav>

      {/* Form Section */}
      <div className="flex items-center justify-center px-4 py-12">
        <form
          onSubmit={handleSubmit}
          className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-8 space-y-6"
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Welcome to Xeno 🎉
            </h2>
            <p className="text-sm text-gray-500">Let’s get you onboarded!</p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Company Name"
              value={form.company_name}
              onChange={(e) =>
                setForm({ ...form, company_name: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
              required
            />

            <input
              type="text"
              placeholder="Your Position"
              value={form.position}
              onChange={(e) =>
                setForm({ ...form, position: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-2 px-4 rounded-lg"
          >
            Continue →
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardForm;
