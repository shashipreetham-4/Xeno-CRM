import db from '../db.js';

export const addOrder = async (req, res) => {
  const { customer_id, amount, order_date } = req.body;

  if (!customer_id || !amount || !order_date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Insert order
    await db.query(
      `INSERT INTO orders (customer_id, amount, order_date)
       VALUES ($1, $2, $3)`,
      [customer_id, amount, order_date]
    );

    // Update customer's total_spent and last_order_date
    await db.query(
      `UPDATE customers
       SET total_spent = (
         SELECT COALESCE(SUM(amount), 0) FROM orders WHERE customer_id = $1
       ),
       last_order_date = (
         SELECT MAX(order_date) FROM orders WHERE customer_id = $1
       )
       WHERE id = $1`,
      [customer_id]
    );

    res.status(201).json({ message: 'Order added and customer updated' });
  } catch (err) {
    console.error('❌ Error adding order:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
