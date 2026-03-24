const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, uuidv4() + ext);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    cb(null, allowed.test(file.mimetype));
  },
});

// PUBLIC: Get all products
router.get('/', async (req, res) => {
  try {
    const { category, featured } = req.query;
    let query = `
      SELECT p.*, 
        (SELECT pp.url FROM product_photos pp WHERE pp.product_id = p.id AND pp.is_primary = true LIMIT 1) as primary_photo,
        (SELECT COUNT(*) FROM product_photos pp WHERE pp.product_id = p.id) as photo_count
      FROM products p
      WHERE 1=1
    `;
    const params = [];
    if (category) { params.push(category); query += ` AND p.category = $${params.length}`; }
    if (featured === 'true') query += ` AND p.is_featured = true`;
    query += ` ORDER BY p.created_at DESC`;
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUBLIC: Get single product with all photos
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    const photos = await pool.query(
      'SELECT * FROM product_photos WHERE product_id = $1 ORDER BY is_primary DESC, sort_order ASC',
      [req.params.id]
    );
    res.json({ ...rows[0], photos: photos.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUBLIC: Get categories
router.get('/meta/categories', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT DISTINCT category FROM products ORDER BY category');
    res.json(rows.map(r => r.category));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN: Create product
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, category, whatsapp_text, is_featured } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO products (name, description, category, whatsapp_text, is_featured) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [name, description, category, whatsapp_text, is_featured || false]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN: Update product
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, category, whatsapp_text, is_featured } = req.body;
    const { rows } = await pool.query(
      `UPDATE products SET name=$1, description=$2, category=$3, whatsapp_text=$4, is_featured=$5, updated_at=NOW()
       WHERE id=$6 RETURNING *`,
      [name, description, category, whatsapp_text, is_featured, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN: Delete product
router.delete('/:id', auth, async (req, res) => {
  try {
    // Get photos to delete files
    const { rows: photos } = await pool.query('SELECT filename FROM product_photos WHERE product_id=$1', [req.params.id]);
    photos.forEach(p => {
      const fp = path.join(__dirname, '../uploads', p.filename);
      if (fs.existsSync(fp)) fs.unlinkSync(fp);
    });
    await pool.query('DELETE FROM products WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN: Upload photos to a product
router.post('/:id/photos', auth, upload.array('photos', 10), async (req, res) => {
  try {
    const productId = req.params.id;
    // Check if product has any primary photo
    const { rows: existing } = await pool.query(
      'SELECT id FROM product_photos WHERE product_id=$1 AND is_primary=true', [productId]
    );
    const hasPrimary = existing.length > 0;

    const inserted = [];
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const url = `/uploads/${file.filename}`;
      const isPrimary = !hasPrimary && i === 0;
      const { rows } = await pool.query(
        'INSERT INTO product_photos (product_id, filename, url, is_primary, sort_order) VALUES ($1,$2,$3,$4,$5) RETURNING *',
        [productId, file.filename, url, isPrimary, i]
      );
      inserted.push(rows[0]);
    }
    res.status(201).json(inserted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN: Set primary photo
router.put('/:id/photos/:photoId/primary', auth, async (req, res) => {
  try {
    await pool.query('UPDATE product_photos SET is_primary=false WHERE product_id=$1', [req.params.id]);
    await pool.query('UPDATE product_photos SET is_primary=true WHERE id=$1', [req.params.photoId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN: Delete photo
router.delete('/:id/photos/:photoId', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT filename FROM product_photos WHERE id=$1', [req.params.photoId]);
    if (rows.length) {
      const fp = path.join(__dirname, '../uploads', rows[0].filename);
      if (fs.existsSync(fp)) fs.unlinkSync(fp);
    }
    await pool.query('DELETE FROM product_photos WHERE id=$1', [req.params.photoId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
