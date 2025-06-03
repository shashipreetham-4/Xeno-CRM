import db from '../db.js';

export const addCustomer = async (req, res) => {
  const { user_id, name, email, phone, total_spent, last_order_date } = req.body;

  if (!user_id || !name || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await db.query(
      `INSERT INTO customers (user_id, name, email, phone, total_spent, last_order_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [user_id, name, email, phone, total_spent, last_order_date]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error adding customer:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCustomers = async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await db.query(
      `SELECT * FROM customers WHERE user_id = $1 ORDER BY created_at DESC`,
      [user_id]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching customers:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, total_spent, last_order_date } = req.body;

  try {
    const result = await db.query(
      `UPDATE customers
       SET name = $1, email = $2, phone = $3, total_spent = $4, last_order_date = $5
       WHERE id = $6 RETURNING *`,
      [name, email, phone, total_spent, last_order_date, id]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error updating customer:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteCustomer = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(`DELETE FROM customers WHERE id = $1`, [id]);
    res.status(200).json({ message: 'Customer deleted' });
  } catch (err) {
    console.error('❌ Error deleting customer:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const bulkAddCustomers = async (req, res) => {
  const { customers, user_id } = req.body;

  if (!Array.isArray(customers) || !user_id) {
    return res.status(400).json({ error: 'Missing customers array or user_id' });
  }

  try {
    for (const row of customers) {
      const {
        name = '',
        email = '',
        phone = '',
        total_spent = 0,
        last_order_date = null,
      } = row;

      if (!name || !email) continue; // skip invalid rows

      await db.query(
        `INSERT INTO customers (user_id, name, email, phone, total_spent, last_order_date)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [user_id, name, email, phone, parseFloat(total_spent), last_order_date]
      );
    }

    res.status(201).json({ message: '✅ Customers uploaded successfully' });
  } catch (err) {
    console.error('❌ Bulk insert error:', err);
    res.status(500).json({ error: 'Failed to upload customers' });
  }
};

