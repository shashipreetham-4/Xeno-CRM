import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar'

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;

        const currentUser = authData?.user;
        if (!currentUser) {
          navigate('/login');
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('company_name, position')
          .eq('id', currentUser.id)
          .single();

        if (profileError) throw profileError;

        if (!profileData?.company_name || !profileData?.position) {
          navigate('/onboarding');
          return;
        }

        setUser(currentUser);
        setProfile(profileData);
      } catch (err) {
        console.error('Dashboard initialization error:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
      alert('Logout failed. Please try again.');
    }
  };

  if (loading) return <div className="p-8 text-center text-lg text-gray-600">Loading dashboard...</div>;

  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen flex flex-col min-h-screen bg-gradient-to-br from-white to-blue-50">


      {/* Body */}
      <main className="max-w-7xl flex-grow mx-auto px-8 py-12">
        <div className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-900 drop-shadow-sm">
            Welcome, <span className="text-blue-700">{profile.company_name}</span> 👋
          </h2>
          <p className="text-gray-500 mt-2 text-lg italic tracking-wide">Position: {profile.position}</p>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <DashboardCard label="➕ Add Customer" link="/add-customer" />
          <DashboardCard label="📦 Add Order" link="/add-order" />
          <DashboardCard label="🎯 Build Segment" link="/segments/new" />
          <DashboardCard label="✉️ Launch Campaign" link="/campaigns/new" />
          <DashboardCard label="📨 Campaign History" link="/campaigns" />
        </section>
      </main>

      <Footer />
    </div>
    
  );
};

const DashboardCard = ({ label, link }) => (
  <Link
    to={link}
    className="relative block bg-white border border-gray-300 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300
               text-center group focus:outline-none focus:ring-4 focus:ring-blue-300"
  >
    <span className="text-xl font-semibold text-blue-800 group-hover:text-blue-900 transition-colors duration-300">
      {label}
    </span>

    <span
      aria-hidden="true"
      className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-1 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    />
  </Link>
);

export default Dashboard;
