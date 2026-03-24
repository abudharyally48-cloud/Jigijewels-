const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// PUBLIC: Track visitor
router.post('/track', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const { page } = req.body;
    await pool.query(
      'INSERT INTO visitors (ip_address, user_agent, page_visited) VALUES ($1,$2,$3)',
      [ip, req.headers['user-agent'], page || '/']
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN: Get visitors stats
router.get('/stats', auth, async (req, res) => {
  try {
    const total = await pool.query('SELECT COUNT(*) FROM visitors');
    const today = await pool.query(
      "SELECT COUNT(*) FROM visitors WHERE visited_at >= NOW() - INTERVAL '24 hours'"
    );
    const week = await pool.query(
      "SELECT COUNT(*) FROM visitors WHERE visited_at >= NOW() - INTERVAL '7 days'"
    );
    const pages = await pool.query(
      "SELECT page_visited, COUNT(*) as count FROM visitors GROUP BY page_visited ORDER BY count DESC LIMIT 10"
    );
    const recent = await pool.query(
      'SELECT * FROM visitors ORDER BY visited_at DESC LIMIT 50'
    );
    res.json({
      total: parseInt(total.rows[0].count),
      today: parseInt(today.rows[0].count),
      week: parseInt(week.rows[0].count),
      topPages: pages.rows,
      recent: recent.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
