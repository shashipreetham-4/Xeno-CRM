import db from '../db.js';

// Convert rule JSON to WHERE clause
const buildWhereClause = (rule) => {
  const conditions = rule.and.map(({ field, operator, value }, index) => {
    const paramNum = index + 1;
    return `${field} ${operator} $${paramNum}`;
  });

  const values = rule.and.map((r) =>
    r.field === 'total_spent' ? parseFloat(r.value) : r.value
  );

  return {
    clause: conditions.join(' AND '),
    values,
  };
};

// 🔍 Preview segment
export const previewSegment = async (req, res) => {
  const { rule, user_id } = req.body;

  if (!rule || !user_id) {
    return res.status(400).json({ error: 'Missing rule or user ID' });
  }

  try {
    const { clause, values } = buildWhereClause(rule);
    const query = `
      SELECT COUNT(*) FROM customers
      WHERE user_id = $${values.length + 1} AND ${clause}
    `;

    const result = await db.query(query, [...values, user_id]);
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