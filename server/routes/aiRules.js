import express from 'express';
import dotenv from 'dotenv';
import { InferenceClient } from '@huggingface/inference';

dotenv.config();
const router = express.Router();
const client = new InferenceClient(process.env.HF_API_KEY);

router.post('/', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt must be a string' });
  }

  const systemPrompt = `
Convert this description into rule objects like:
[
  { "field": "total_spent", "operator": ">", "value": 5000 },
  { "field": "last_order_date", "operator": "<", "value": "2024-05-01" }
]

Description: ${prompt}
`;

  try {
    const response = await client.chatCompletion({
      model: 'mistralai/Mistral-7B-Instruct-v0.3',
      messages: [{ role: 'user', content: systemPrompt }]
    });

    const raw = response.choices?.[0]?.message?.content?.trim();
    const rules = JSON.parse(raw);
    res.json({ rules });
  } catch (error) {
    console.error('❌ AI rule error:', error.message);
    res.status(500).json({ error: 'Failed to generate rules' });
  }
});

export default router;
