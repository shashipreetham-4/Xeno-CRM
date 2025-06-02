import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const { data: authData } = await supabase.auth.getUser();
      const currentUser = authData?.user;

      if (!currentUser) {
        navigate('/login');
        return;
      }

      const { data: profile, error } = await supabase
        .from('users')
        .select('company_name, position')
        .eq('id', currentUser.id)
        .single();

      if (error || !profile) {
        console.error('Profile error:', error);
        navigate('/onboarding');
        return;
      }

      if (!profile.company_name || !profile.position) {
        navigate('/onboarding');
        return;
      }

      setUser(currentUser);
      setProfile(profile);
      setLoading(false);
    };

    init();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-lg">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="flex justify-between items-center px-6 py-4 bg-white border-b shadow-sm">
        <h1 className="text-xl font-bold text-blue-600">Xeno CRM</h1>

        <nav className="flex gap-6 items-center text-sm font-medium text-gray-700">
          <a href="/customers" className="hover:text-blue-600">Customers</a>
          <a href="/segments/new" className="hover:text-blue-600">Segments</a>
          <a href="/campaigns" className="hover:text-blue-600">Campaigns</a>

          <div
            className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-100 text-blue-800 font-bold cursor-pointer"
            title={`Logout (${user.email})`}
            onClick={handleLogout}
          >
            {user.email[0].toUpperCase()}
          </div>
        </nav>
      </header>

      {/* Body */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">
            Welcome, {profile.company_name} 👋
          </h2>
          <p className="text-gray-600 mt-1 text-sm">
            Position: {profile.position}
          </p>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <DashboardCard label="➕ Add Customer" link="/add-customer" />
          <DashboardCard label="📦 Add Order" link="/add-order" />
          <DashboardCard label="🎯 Build Segment" link="/segments/new" />
          <DashboardCard label="✉️ Launch Campaign" link="/campaigns/new" />
          <DashboardCard label="📨 Campaign History" link="/campaigns" />
        </section>
      </main>
    </div>
  );
};

const DashboardCard = ({ label, link }) => (
  <a
    href={link}
    className="bg-white border border-gray-200 p-6 rounded-xl shadow hover:shadow-md transition text-center"
  >
    <span className="text-lg font-medium text-blue-800">{label}</span>
  </a>
);

export default Dashboard;
