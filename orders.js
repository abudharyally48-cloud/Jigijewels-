const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// PUBLIC: Create order (when user taps WhatsApp button)
router.post('/', async (req, res) => {
  try {
    const { product_id, product_name, customer_name, customer_phone, message } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO orders (product_id, product_name, customer_name, customer_phone, message) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [product_id, product_name, customer_name, customer_phone, message]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN: Get all orders
router.get('/', auth, async (req, res) => {
  try {
    const { status } = req.query;
    let query = `
      SELECT o.*, p.name as product_name_ref FROM orders o
      LEFT JOIN products p ON o.product_id = p.id
      WHERE 1=1
    `;
    const params = [];
    if (status) { params.push(status); query += ` AND o.status = $${params.length}`; }
    query += ` ORDER BY o.created_at DESC`;
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN: Update order status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['new', 'contacted', 'completed', 'cancelled'];
    if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });
    const { rows } = await pool.query(
      'UPDATE orders SET status=$1 WHERE id=$2 RETURNING *',
      [status, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN: Delete order
router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM orders WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN: Order stats
router.get('/stats', auth, async (req, res) => {
  try {
    const total = await pool.query('SELECT COUNT(*) FROM orders');
    const byStatus = await pool.query('SELECT status, COUNT(*) as count FROM orders GROUP BY status');
    const recent = await pool.query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 20');
    res.json({
      total: parseInt(total.rows[0].count),
      byStatus: byStatus.rows,
      recent: recent.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
