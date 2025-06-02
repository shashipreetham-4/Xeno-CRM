import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const fields = ['total_spent', 'last_order_date'];
const operators = ['>', '<', '=', '>=', '<='];

const SegmentBuilder = () => {
  const [rules, setRules] = useState([{ field: '', operator: '', value: '' }]);
  const [audienceSize, setAudienceSize] = useState(null);
  const [userId, setUserId] = useState(null);
  const [segmentName, setSegmentName] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    getUser();
  }, []);

  const handleRuleChange = (index, key, value) => {
    const updated = [...rules];
    updated[index][key] = value;
    setRules(updated);
  };

  const addRule = () => {
    setRules([...rules, { field: '', operator: '', value: '' }]);
  };

  const buildRuleJSON = () => ({ and: rules });

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
    const res = await fetch('/api/segments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: segmentName,
        rule_json: buildRuleJSON(),
        user_id: userId,
      }),
    });
    if (res.ok) alert('✅ Segment saved!');
    else alert('❌ Error saving segment');
  };

  const handleAIConvert = async () => {
    if (!aiPrompt) return alert('Please enter a prompt');
    try {
      setLoadingAI(true);
      const res = await fetch('/api/ai/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      const data = await res.json();
      if (Array.isArray(data.rules)) {
        setRules(data.rules);
      } else {
        alert('AI did not return valid rules.');
      }
    } catch (err) {
      alert('AI error: ' + err.message);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">🎯 Build a Segment</h2>

      <input
        type="text"
        placeholder="Segment Name"
        value={segmentName}
        onChange={(e) => setSegmentName(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
      />

      <div className="mt-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Define rules via AI</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder='e.g. "Users inactive for 60 days and spent over 5000"'
            className="flex-1 p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleAIConvert}
            disabled={loadingAI}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loadingAI ? 'Generating...' : '✨ AI Convert'}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {rules.map((rule, i) => (
          <div key={i} className="flex gap-2">
            <select
              value={rule.field}
              onChange={(e) => handleRuleChange(i, 'field', e.target.value)}
              className="flex-1 p-2 border rounded"
            >
              <option value="">Field</option>
              {fields.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>

            <select
              value={rule.operator}
              onChange={(e) => handleRuleChange(i, 'operator', e.target.value)}
              className="w-20 p-2 border rounded"
            >
              <option value="">Op</option>
              {operators.map((op) => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>

            <input
              value={rule.value}
              onChange={(e) => handleRuleChange(i, 'value', e.target.value)}
              placeholder="Value"
              className="flex-1 p-2 border rounded"
            />
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={addRule} className="bg-gray-200 px-4 py-2 rounded">➕ Add Rule</button>
        <button onClick={previewAudience} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">🔍 Preview</button>
        <button onClick={saveSegment} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">💾 Save</button>
      </div>

      {audienceSize !== null && (
        <div className="text-lg font-medium text-blue-700">
          Matched Audience: {audienceSize}
        </div>
      )}
    </div>
  );
};

export default SegmentBuilder;
