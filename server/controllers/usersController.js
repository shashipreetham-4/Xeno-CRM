import db from '../db.js';

export const syncUser = async (req, res) => {
  const { id, email, name } = req.body;

  if (!id || !email) {
    return res.status(400).json({ error: 'Missing id or email' });
  }

  try {
    await db.query(
      `INSERT INTO users (id, email, name)
       VALUES ($1, $2, $3)
       ON CONFLICT (id) DO NOTHING`,
      [id, email, name]
    );

    res.status(200).json({ message: 'User synced' });
  } catch (error) {
    console.error('❌ Error syncing user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
