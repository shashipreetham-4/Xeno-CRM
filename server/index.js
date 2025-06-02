import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import customerRoutes from './routes/customers.js';
import orderRoutes from './routes/orders.js';
import userRoutes from './routes/users.js'; // ✅ new user sync route
import segmentRoutes from './routes/segments.js';
import campaignRoutes from './routes/campaigns.js';
import aiRules from './routes/aiRules.js';
import aiMessages from './routes/aiMessages.js';

import db from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 🧩 Middleware
app.use(cors());
app.use(express.json());

// 🧭 Routes
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes); // ✅ users route registered
app.use('/api/segments', segmentRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/ai/rules', aiRules);
app.use('/api/ai/messages', aiMessages);

// ✅ Health check route
app.get('/ping', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ success: true, server_time: result.rows[0].now });
  } catch (err) {
    console.error('❌ DB ping error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 👋 Root route
app.get('/', (req, res) => {
  res.send('🚀 CRM API is up and running!');
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
