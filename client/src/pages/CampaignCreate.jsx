import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const CampaignCreate = () => {
  const [segments, setSegments] = useState([]);
  const [userId, setUserId] = useState(null);
  const [segmentId, setSegmentId] = useState('');
  const [message, setMessage] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

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
      alert('✅ Campaign launched!');
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
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">✉️ Launch a Campaign</h2>

      {/* Segment Selector */}
      <div>
        <label className="block mb-1 text-sm font-medium">Select Segment</label>
        <select
          value={segmentId}
          onChange={(e) => setSegmentId(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">-- Select Segment --</option>
          {segments.map((seg) => (
            <option key={seg.id} value={seg.id}>
              {seg.name}
            </option>
          ))}
        </select>
      </div>

      {/* AI Message Prompt */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Describe Message Goal (AI will generate)</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder='e.g. "Bring back VIP customers with 20% off"'
            className="flex-1 p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleAIGenerate}
            disabled={loadingAI}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {loadingAI ? 'Generating...' : '✨ AI Generate'}
          </button>
        </div>
      </div>

      {/* Final Message Box */}
      <div>
        <label className="block mb-1 text-sm font-medium">Final Campaign Message</label>
        <textarea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Hi {name}, we miss you! Here's 10% off just for you."
          className="w-full p-3 border rounded"
        />
      </div>

      {/* Launch */}
      <button
        onClick={handleLaunch}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        🚀 Launch Campaign
      </button>
    </div>
  );
};

export default CampaignCreate;
