import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

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
      setCampaigns(data);
    };

    fetchCampaigns();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📨 Campaign History</h2>

      {campaigns.length === 0 ? (
        <p>No campaigns launched yet.</p>
      ) : (
        <div className="space-y-4">
          {campaigns.map((c) => (
            <div
              key={c.id}
              className="p-4 border border-gray-300 rounded-lg shadow-sm bg-white"
            >
              <div className="text-sm text-gray-500">
                {new Date(c.created_at).toLocaleString()}
              </div>
              <div className="font-medium my-1">{c.message}</div>
              <div className="flex space-x-6 mt-2 text-sm">
                <span>👥 Targeted: {c.total}</span>
                <span className="text-green-600">✅ Sent: {c.sent}</span>
                <span className="text-red-500">❌ Failed: {c.failed}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignHistory;
