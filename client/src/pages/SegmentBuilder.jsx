import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const fields = ['total_spent', 'last_order_date', 'inactive_for_days'];
const operators = ['>', '<', '=', '>=', '<='];

const SegmentBuilder = () => {
  const [segmentName, setSegmentName] = useState('');
  const [userId, setUserId] = useState(null);
  const [audienceSize, setAudienceSize] = useState(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  const [ruleGroups, setRuleGroups] = useState([
    { and: [{ field: '', operator: '', value: '' }] }
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    getUser();
  }, []);

  const handleGroupRuleChange = (groupIdx, ruleIdx, key, value) => {
    const updated = [...ruleGroups];
    updated[groupIdx].and[ruleIdx][key] = value;
    setRuleGroups(updated);
  };

  const addRuleToGroup = (groupIdx) => {
    const updated = [...ruleGroups];
    updated[groupIdx].and.push({ field: '', operator: '', value: '' });
    setRuleGroups(updated);
  };

  const removeRuleFromGroup = (groupIdx, ruleIdx) => {
    const updated = [...ruleGroups];
    updated[groupIdx].and.splice(ruleIdx, 1);
    if (updated[groupIdx].and.length === 0) {
      updated[groupIdx].and.push({ field: '', operator: '', value: '' });
    }
    setRuleGroups(updated);
  };

  const addGroup = () => {
    setRuleGroups([...ruleGroups, { and: [{ field: '', operator: '', value: '' }] }]);
  };

  const removeGroup = (groupIdx) => {
    const updated = [...ruleGroups];
    updated.splice(groupIdx, 1);
    if (updated.length === 0) {
      updated.push({ and: [{ field: '', operator: '', value: '' }] });
    }
    setRuleGroups(updated);
  };

  const buildRuleJSON = () => ({ or: ruleGroups });

  const previewAudience = async () => {
    const res = await fetch('/api/segments/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rule: buildRuleJSON(), user_id: userId }),
    });
    const data = await res.json();
    setAudienceSize(data.count);
  };

  const saveSegment = async () => {
    if (!segmentName.trim()) {
      alert('Segment name is required!');
      return;
    }

    const res = await fetch('/api/segments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: segmentName,
        rule_json: buildRuleJSON(),
        user_id: userId,
      }),
    });

    if (res.ok) {
      alert('✅ Segment saved!');
      navigate('/campaigns');
    } else {
      alert('❌ Error saving segment');
    }
  };

  const handleAIConvert = async () => {
    if (!aiPrompt.trim()) return alert('Please enter a prompt');
    setLoadingAI(true);
    try {
      const res = await fetch('/api/ai/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      const data = await res.json();
      if (data.rules && Array.isArray(data.rules.or)) {
        setRuleGroups(data.rules.or);
      } else {
        alert('Invalid rule format returned by AI');
      }
    } catch (err) {
      alert('AI error: ' + err.message);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow max-w-3xl mx-auto px-6 py-8 space-y-10">
        <h2 className="text-3xl font-extrabold text-gray-800">🎯 Build a Segment</h2>

        {/* Segment Name */}
        <section className="bg-white p-6 rounded-lg shadow border">
          <label className="block font-semibold text-gray-700 mb-2">Segment Name</label>
          <input
            type="text"
            value={segmentName}
            onChange={(e) => setSegmentName(e.target.value)}
            placeholder="e.g. High Spenders"
            className="w-full p-3 border border-gray-300 rounded"
          />
        </section>

        {/* AI Prompt */}
        <section className="bg-white p-6 rounded-lg shadow border">
          <label className="block font-semibold text-gray-700 mb-2">Define via AI</label>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder='e.g. users inactive for 90 days and spent > 5000'
              className="flex-grow p-3 border border-gray-300 rounded"
            />
            <button
              onClick={handleAIConvert}
              disabled={loadingAI}
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-60"
            >
              {loadingAI ? 'Generating...' : '✨ AI Convert'}
            </button>
          </div>
        </section>

        {/* Rules Builder */}
        <section className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Segment Rules (OR Groups)</h3>

          {ruleGroups.map((group, gIdx) => (
            <div key={gIdx} className="mb-6 p-4 border border-blue-200 bg-blue-50 rounded relative">
              <button
                onClick={() => removeGroup(gIdx)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-sm"
                title="Remove group"
              >
                🗑️
              </button>

              <h4 className="font-medium mb-2">Group {gIdx + 1} (AND)</h4>
              {group.and.map((rule, rIdx) => (
                <div key={rIdx} className="flex flex-col sm:flex-row gap-3 mb-2 items-center">
                  <select
                    value={rule.field}
                    onChange={(e) => handleGroupRuleChange(gIdx, rIdx, 'field', e.target.value)}
                    className="flex-1 p-2 border rounded"
                  >
                    <option value="">Field</option>
                    {fields.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                  <select
                    value={rule.operator}
                    onChange={(e) => handleGroupRuleChange(gIdx, rIdx, 'operator', e.target.value)}
                    className="w-28 p-2 border rounded"
                  >
                    <option value="">Operator</option>
                    {operators.map((op) => (
                      <option key={op} value={op}>{op}</option>
                    ))}
                  </select>
                  <input
                    value={rule.value}
                    onChange={(e) => handleGroupRuleChange(gIdx, rIdx, 'value', e.target.value)}
                    placeholder={rule.field === 'inactive_for_days' ? 'Days' : 'Value'}
                    className="flex-1 p-2 border rounded"
                  />
                  <button
                    onClick={() => removeRuleFromGroup(gIdx, rIdx)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    ❌
                  </button>
                </div>
              ))}

              <button
                onClick={() => addRuleToGroup(gIdx)}
                className="mt-2 text-sm text-blue-700 hover:underline"
              >
                ➕ Add Rule
              </button>
            </div>
          ))}

          <button
            onClick={addGroup}
            className="mt-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
          >
            ➕ Add OR Group
          </button>
        </section>

        {/* Actions */}
        <section className="flex flex-col sm:flex-row gap-4 justify-end items-center">
          <button
            onClick={previewAudience}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 w-full sm:w-auto"
          >
            🔍 Preview Audience
          </button>
          <button
            onClick={saveSegment}
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 w-full sm:w-auto"
          >
            💾 Save Segment
          </button>
        </section>

        {audienceSize !== null && (
          <p className="text-center text-lg text-blue-800 font-medium">
            Matched Audience: {audienceSize}
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SegmentBuilder;
