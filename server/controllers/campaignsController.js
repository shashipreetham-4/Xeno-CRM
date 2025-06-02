import db from '../db.js';
import { v4 as uuidv4 } from 'uuid';

export const launchCampaign = async (req, res) => {
  const { segment_id, message, user_id } = req.body;

  if (!segment_id || !message || !user_id)
    return res.status(400).json({ error: 'Missing fields' });

  try {
    // 1. Get segment + rule
    const segmentRes = await db.query(
      `SELECT rule_json FROM segments WHERE id = $1 AND user_id = $2`,
      [segment_id, user_id]
    );
    const segment = segmentRes.rows[0];
    if (!segment) return res.status(404).json({ error: 'Segment not found' });

    // 2. Build WHERE clause
    const rule = segment.rule_json;
    const conditions = rule.and.map(
      ({ field, operator }, i) => `${field} ${operator} $${i + 1}`
    );
    const values = rule.and.map((r) =>
      r.field === 'total_spent' ? parseFloat(r.value) : r.value
    );

    const customerQuery = `
      SELECT * FROM customers WHERE user_id = $${values.length + 1} AND ${conditions.join(' AND ')}
    `;
    const customersRes = await db.query(customerQuery, [...values, user_id]);
    const customers = customersRes.rows;

    // 3. Create campaign_id and insert into campaigns table
    const campaignId = uuidv4();

    await db.query(
      `INSERT INTO campaigns (id, user_id, segment_id, message)
       VALUES ($1, $2, $3, $4)`,
      [campaignId, user_id, segment_id, message]
    );

    // 4. Simulate sending message
    for (const cust of customers) {
      const personalized = message.replace('{name}', cust.name);
      const status = Math.random() < 0.9 ? 'SENT' : 'FAILED';

      await db.query(
        `INSERT INTO communication_log (campaign_id, customer_id, message, status)
         VALUES ($1, $2, $3, $4)`,
        [campaignId, cust.id, personalized, status]
      );

      // Simulate hitting delivery receipt (optional for now)
      await fetch('http://localhost:3000/api/campaigns/delivery-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign_id: campaignId,
          customer_id: cust.id,
          status,
        }),
      });
    }

    res.status(201).json({ campaign_id: campaignId, total: customers.length });
  } catch (err) {
    console.error('❌ Campaign error:', err);
    res.status(500).json({ error: 'Failed to launch campaign' });
  }
};

export const deliveryReceiptHandler = async (req, res) => {
  const { campaign_id, customer_id, status } = req.body;

  try {
    await db.query(
      `UPDATE communication_log
       SET status = $1, delivery_time = NOW()
       WHERE campaign_id = $2 AND customer_id = $3`,
      [status, campaign_id, customer_id]
    );

    res.status(200).json({ message: 'Delivery receipt logged' });
  } catch (err) {
    console.error('❌ Receipt error:', err);
    res.status(500).json({ error: 'Failed to update delivery status' });
  }
};

export const getCampaignHistory = async (req, res) => {
  const { user_id } = req.params;

  try {
    const campaignsRes = await db.query(
      `SELECT c.id, c.message, c.created_at,
              COUNT(cl.id) AS total,
              COUNT(CASE WHEN cl.status = 'SENT' THEN 1 END) AS sent,
              COUNT(CASE WHEN cl.status = 'FAILED' THEN 1 END) AS failed
         FROM campaigns c
         LEFT JOIN communication_log cl ON c.id = cl.campaign_id
         WHERE c.user_id = $1
         GROUP BY c.id
         ORDER BY c.created_at DESC`,
      [user_id]
    );

    res.status(200).json(campaignsRes.rows);
  } catch (err) {
    console.error('❌ Error fetching campaign history:', err);
    res.status(500).json({ error: 'Failed to load campaign history' });
  }
};

