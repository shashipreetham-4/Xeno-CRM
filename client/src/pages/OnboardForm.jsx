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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow rounded-lg w-full max-w-md space-y-4"
      >
        <h2 className="text-xl text-black font-bold">Welcome! Complete your profile</h2>

        <input
          type="text"
          placeholder="Company Name"
          value={form.company_name}
          onChange={(e) => setForm({ ...form, company_name: e.target.value })}
          className="w-full p-2 border text-black rounded"
          required
        />

        <input
          type="text"
          placeholder="Your Position"
          value={form.position}
          onChange={(e) => setForm({ ...form, position: e.target.value })}
          className="w-full p-2 border text-black rounded"
          required
        />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Continue
        </button>
      </form>
    </div>
  );
};

export default OnboardForm;
