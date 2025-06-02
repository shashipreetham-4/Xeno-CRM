import express from 'express';
import dotenv from 'dotenv';
import { InferenceClient } from '@huggingface/inference';

dotenv.config();
const router = express.Router();
const client = new InferenceClient(process.env.HF_API_KEY);

router.post('/', async (req, res) => {
  const { goal } = req.body;

  if (!goal || typeof goal !== 'string') {
    return res.status(400).json({ error: 'Goal must be a string' });
  }

  const prompt = `
Generate a short SMS marketing message for the following goal:
"${goal}"

Use {name} as placeholder. Example: "Hi {name}, enjoy 20% off today!"
`;

  try {
    const response = await client.chatCompletion({
      model: 'mistralai/Mistral-7B-Instruct-v0.3',
      messages: [{ role: 'user', content: prompt }]
    });

    const message = response.choices?.[0]?.message?.content?.trim();
    res.json({ message });
  } catch (error) {
    console.error('❌ AI message error:', error.message);
    res.status(500).json({ error: 'Failed to generate message' });
  }
});

export default router;
