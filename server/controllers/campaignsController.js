import db from '../db.js';
import { v4 as uuidv4 } from 'uuid';

export const launchCampaign = async (req, res) => {
  const { segment_id, message, user_id } = req.body;

  if (!segment_id || !message || !user_id)
    return res.status(400).json({ error: 'Missing fields' });

  try {
    // 1. Fetch segment + rules
    const segmentRes = await db.query(
      `SELECT rule_json FROM segments WHERE id = $1 AND user_id = $2`,
      [segment_id, user_id]
    );
    const segment = segmentRes.rows[0];
    if (!segment) return res.status(404).json({ error: 'Segment not found' });

    const rule = segment.rule_json;
    if (!rule || !Array.isArray(rule.or)) {
      return res.status(400).json({ error: 'Invalid rule structure in segment' });
    }

    // 2. Evaluate each OR group
    let matchedCustomers = [];

    for (const group of rule.or) {
      const groupConditions = [];
      const values = [];
      let paramIdx = 1;

      for (const r of group.and) {
        if (r.field === 'inactive_for_days') {
          groupConditions.push(`last_order_date < CURRENT_DATE - INTERVAL '${r.value} days'`);
        } else {
          groupConditions.push(`${r.field} ${r.operator} $${paramIdx}`);
          values.push(r.field === 'total_spent' ? parseFloat(r.value) : r.value);
          paramIdx++;
        }
      }

      const clause = groupConditions.length > 0
        ? `user_id = $${paramIdx} AND (${groupConditions.join(' AND ')})`
        : `user_id = $${paramIdx}`;

      values.push(user_id);

      const customerRes = await db.query(`SELECT * FROM customers WHERE ${clause}`, values);
      matchedCustomers.push(...customerRes.rows);
    }

    // 3. Remove duplicates
    const uniqueCustomers = Object.values(
      matchedCustomers.reduce((acc, cust) => {
        acc[cust.id] = cust;
        return acc;
      }, {})
    );

    // 4. Insert campaign
    const campaignId = uuidv4();

    await db.query(
      `INSERT INTO campaigns (id, user_id, segment_id, message)
       VALUES ($1, $2, $3, $4)`,
      [campaignId, user_id, segment_id, message]
    );

    // 5. Send to communication_log
    for (const cust of uniqueCustomers) {
      const personalized = message.replace('{name}', cust.name);
      const status = Math.random() < 0.9 ? 'SENT' : 'FAILED';

      await db.query(
        `INSERT INTO communication_log (campaign_id, customer_id, message, status)
         VALUES ($1, $2, $3, $4)`,
        [campaignId, cust.id, personalized, status]
      );

      // simulate vendor delivery receipt
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

    res.status(201).json({ campaign_id: campaignId, total: uniqueCustomers.length });
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

