import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CampaignCreate = () => {
  const [segments, setSegments] = useState([]);
  const [userId, setUserId] = useState(null);
  const [segmentId, setSegmentId] = useState('');
  const [message, setMessage] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndSegments = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);

        const res = await fetch(`/api/segments/user/${user.id}`);
        const data = await res.json();
        setSegments(data);
      }
    };
    fetchUserAndSegments();
  }, []);

  const handleLaunch = async () => {
    if (!segmentId || !message) {
      alert('Please select a segment and type a message.');
      return;
    }

    const res = await fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        segment_id: segmentId,
        message,
        user_id: userId,
      }),
    });

    if (res.ok) {
      navigate('/campaigns');
    } else {
      alert('❌ Failed to launch campaign');
    }
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt) return alert('Please enter a campaign goal');
    try {
      setLoadingAI(true);
      const res = await fetch('/api/ai/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: aiPrompt }),
      });
      const data = await res.json();
      if (data.message) {
        setMessage(data.message);
      } else {
        alert('AI failed to generate message.');
      }
    } catch (err) {
      alert('AI error: ' + err.message);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">

      <main className="flex-grow flex justify-center p-6">
        <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8 space-y-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            ✉️ Launch a Campaign
          </h2>

          {/* Segment Selector Card */}
          <section className="bg-gray-50 rounded-lg p-6 shadow-inner border border-gray-200">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Select Segment</h3>
            <select
              value={segmentId}
              onChange={(e) => setSegmentId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
            >
              <option value="" disabled>
                -- Select Segment --
              </option>
              {segments.map((seg) => (
                <option key={seg.id} value={seg.id}>
                  {seg.name}
                </option>
              ))}
            </select>
          </section>

          {/* AI Message Prompt Card */}
          <section className="bg-gray-50 rounded-lg p-6 shadow-inner border border-gray-200">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Describe Message Goal <span className="font-normal text-gray-500">(AI will generate)</span>
            </h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder='e.g. "Bring back VIP customers with 20% off"'
                className="flex-1 p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-600 focus:outline-none transition"
              />
              <button
                onClick={handleAIGenerate}
                disabled={loadingAI}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-60 font-semibold"
              >
                {loadingAI ? 'Generating...' : '✨ AI Generate'}
              </button>
            </div>
          </section>

          {/* Final Message Box Card */}
          <section className="bg-gray-50 rounded-lg p-6 shadow-inner border border-gray-200">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Final Campaign Message</h3>
            <textarea
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi {name}, we miss you! Here's 10% off just for you."
              className="w-full p-4 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:outline-none transition resize-none"
            />
          </section>

          {/* Launch Button Card */}
          <section className="bg-white rounded-lg p-6 text-center">
            <button
              onClick={handleLaunch}
              className="bg-blue-600 text-white px-10 py-4 rounded-lg hover:bg-blue-700 transition font-semibold text-lg shadow-md"
            >
              🚀 Launch Campaign
            </button>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CampaignCreate;
