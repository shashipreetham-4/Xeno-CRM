import db from '../db.js';

// 🧠 Build WHERE clause from advanced rule object with OR + AND support
const buildWhereClauseFromGroups = (rule, user_id) => {
  const orConditions = [];
  const values = [];
  let paramCounter = 1;

  for (const group of rule.or) {
    const andParts = [];

    for (const r of group.and) {
      const { field, operator, value } = r;

      if (field === 'inactive_for_days') {
        // Directly inject INTERVAL logic without bind variable
        andParts.push(`last_order_date < CURRENT_DATE - INTERVAL '${value} days'`);
      } else {
        andParts.push(`${field} ${operator} $${paramCounter}`);
        values.push(field === 'total_spent' ? parseFloat(value) : value);
        paramCounter++;
      }
    }

    if (andParts.length > 0) {
      orConditions.push(`(${andParts.join(' AND ')})`);
    }
  }

  const clause = orConditions.length > 0 ? `(${orConditions.join(' OR ')})` : 'TRUE';
  values.push(user_id); // Append user_id at the end

  return {
    clause: `user_id = $${paramCounter} AND ${clause}`,
    values,
  };
};

// 🔍 Preview segment audience count
export const previewSegment = async (req, res) => {
  const { rule, user_id } = req.body;

  if (!rule || !user_id) {
    return res.status(400).json({ error: 'Missing rule or user ID' });
  }

  try {
    const { clause, values } = buildWhereClauseFromGroups(rule, user_id);
    const query = `SELECT COUNT(*) FROM customers WHERE ${clause}`;

    const result = await db.query(query, values);
    const count = parseInt(result.rows[0].count, 10);

    res.status(200).json({ count });
  } catch (err) {
    console.error('❌ Preview error:', err);
    res.status(500).json({ error: 'Preview failed' });
  }
};

// 💾 Save segment
export const saveSegment = async (req, res) => {
  const { name, rule_json, user_id } = req.body;

  if (!name || !rule_json || !user_id) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const result = await db.query(
      `INSERT INTO segments (name, rule_json, user_id)
       VALUES ($1, $2, $3) RETURNING *`,
      [name, rule_json, user_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Save error:', err);
    res.status(500).json({ error: 'Failed to save segment' });
  }
};

// 📦 Fetch all segments for a user
export const getSegmentsByUser = async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await db.query(
      `SELECT id, name FROM segments WHERE user_id = $1 ORDER BY created_at DESC`,
      [user_id]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching segments:', err);
    res.status(500).json({ error: 'Failed to fetch segments' });
  }
};
