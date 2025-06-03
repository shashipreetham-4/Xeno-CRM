import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CampaignHistory = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const res = await fetch(`/api/campaigns/user/${user.id}`);
      const data = await res.json();

      // Sort campaigns by date (most recent first)
      const sorted = data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setCampaigns(sorted);
    };

    fetchCampaigns();
  }, []);

  return (
    <>
      <div className="pt-20 px-6 max-w-6xl mx-auto min-h-screen">
        <h2 className="text-3xl font-bold mb-8 text-blue-800">📨 Campaign History</h2>

        {campaigns.length === 0 ? (
          <p className="text-gray-600">No campaigns launched yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((c) => (
  <div
    key={c.id}
    className="group relative flex flex-col justify-between bg-white border border-gray-200 rounded-xl shadow-lg p-5 hover:shadow-xl transition-shadow duration-300 min-h-[220px]"
  >
    <div>
      <div className="text-sm text-gray-500 mb-2">
        📅 {new Date(c.created_at).toLocaleString()}
      </div>
      <div className="text-lg font-semibold text-gray-800 mb-4">
        {c.message}
      </div>
    </div>

    <div className="flex justify-between text-sm mt-auto pt-4 border-t border-gray-100">
      <span className="text-gray-700">👥 {c.total} targeted</span>
      <span className="text-green-600">✅ {c.sent} sent</span>
      <span className="text-red-500">❌ {c.failed} failed</span>
    </div>

    {/* Blue hover line animation */}
    <span className="absolute left-0 bottom-0 w-full h-1 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-xl" />
  </div>
))}

          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CampaignHistory;
