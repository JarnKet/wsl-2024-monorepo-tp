const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { requireAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { validateGTIN, validateWeightUnit } = require('../utils/validation');
const { formatProductResponse } = require('../utils/helpers');

// Get all products with pagination and search
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.per_page) || 10;
  const searchQuery = req.query.query || '';
  const offset = (page - 1) * perPage;

  let whereClause = 'WHERE p.is_hidden = FALSE AND c.is_deactivated = FALSE';
  let searchParams = [];

  if (searchQuery) {
    whereClause += ` AND (
      p.name_en LIKE ? OR p.name_fr LIKE ? OR
      p.description_en LIKE ? OR p.description_fr LIKE ?
    )`;
    const searchTerm = `%${searchQuery}%`;
    searchParams = [searchTerm, searchTerm, searchTerm, searchTerm];
  }

  try {
    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM products p
       JOIN companies c ON p.company_id = c.id ${whereClause}`,
      searchParams
    );
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / perPage);

    // Get products - Use string interpolation for LIMIT/OFFSET to avoid parameter issues
    const limitClause = `LIMIT ${parseInt(perPage)} OFFSET ${parseInt(offset)}`;

    const [rows] = await pool.execute(
      `SELECT p.*, c.* FROM products p
       JOIN companies c ON p.company_id = c.id
       ${whereClause}
       ORDER BY p.name_en
       ${limitClause}`,
      searchParams
    );

    const baseUrl = `${req.protocol}://${req.get('host')}/api/products`;

    res.json({
      data: rows.map(row => formatProductResponse(row)),
      pagination: {
        current_page: page,
        total_pages: totalPages,
        per_page: perPage,
        next_page_url: page < totalPages ? `${baseUrl}?page=${page + 1}` : null,
        prev_page_url: page > 1 ? `${baseUrl}?page=${page - 1}` : null
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all products for admin (including hidden)
router.get('/admin', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT p.*, c.* FROM products p
       JOIN companies c ON p.company_id = c.id
       ORDER BY p.name_en`
    );
    res.json(rows.map(row => formatProductResponse(row)));
  } catch (error) {
    console.error('Error fetching admin products:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get single product
router.get('/:gtin', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT p.*, c.* FROM products p
       JOIN companies c ON p.company_id = c.id
       WHERE p.gtin = ? AND p.is_hidden = FALSE AND c.is_deactivated = FALSE`,
      [req.params.gtin]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(formatProductResponse(rows[0]));
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get single product for admin
router.get('/admin/:gtin', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT p.*, c.* FROM products p
       JOIN companies c ON p.company_id = c.id
       WHERE p.gtin = ?`,
      [req.params.gtin]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(formatProductResponse(rows[0]));
  } catch (error) {
    console.error('Error fetching admin product:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Create product
router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  const {
    gtin, company_id, name_en, name_fr, description_en, description_fr,
    brand, country_of_origin, gross_weight, net_weight, weight_unit
  } = req.body;

  // Validation
  if (!validateGTIN(gtin)) {
    return res.status(400).json({ error: 'Invalid GTIN format. Must be 13-14 digits.' });
  }

  if (!validateWeightUnit(weight_unit)) {
    return res.status(400).json({ error: 'Invalid weight unit' });
  }

  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const [result] = await pool.execute(
      `INSERT INTO products (
        gtin, company_id, name_en, name_fr, description_en, description_fr,
        brand, country_of_origin, gross_weight, net_weight, weight_unit, image_path
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [gtin, company_id, name_en, name_fr, description_en, description_fr,
       brand, country_of_origin, gross_weight, net_weight, weight_unit, imagePath]
    );

    res.status(201).json({ gtin, message: 'Product created successfully' });
  } catch (error) {
    console.error('Error creating product:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'GTIN already exists' });
    } else {
      res.status(500).json({ error: 'Database error' });
    }
  }
});

// Update product
router.put('/:gtin', requireAuth, upload.single('image'), async (req, res) => {
  const {
    company_id, name_en, name_fr, description_en, description_fr,
    brand, country_of_origin, gross_weight, net_weight, weight_unit, is_hidden
  } = req.body;

  try {
    let query = `UPDATE products SET
      company_id = ?, name_en = ?, name_fr = ?, description_en = ?, description_fr = ?,
      brand = ?, country_of_origin = ?, gross_weight = ?, net_weight = ?, weight_unit = ?, is_hidden = ?,
      updated_at = CURRENT_TIMESTAMP`;

    let params = [company_id, name_en, name_fr, description_en, description_fr,
                  brand, country_of_origin, gross_weight, net_weight, weight_unit, is_hidden];

    if (req.file) {
      query += `, image_path = ?`;
      params.push(`/uploads/${req.file.filename}`);
    }

    query += ` WHERE gtin = ?`;
    params.push(req.params.gtin);

    const [result] = await pool.execute(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete product (only hidden products can be deleted)
router.delete('/:gtin', requireAuth, async (req, res) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM products WHERE gtin = ? AND is_hidden = TRUE',
      [req.params.gtin]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found or not hidden' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Remove product image
router.delete('/:gtin/image', requireAuth, async (req, res) => {
  try {
    const [result] = await pool.execute(
      'UPDATE products SET image_path = NULL WHERE gtin = ?',
      [req.params.gtin]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product image removed successfully' });
  } catch (error) {
    console.error('Error removing product image:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// GTIN Bulk Verification API
router.post('/verify', async (req, res) => {
  const { gtins } = req.body;

  if (!Array.isArray(gtins)) {
    return res.status(400).json({ error: 'GTINs must be provided as an array' });
  }

  try {
    const results = [];
    let allValid = true;

    for (const gtin of gtins) {
      const cleanGtin = gtin.trim();
      if (cleanGtin) {
        const [rows] = await pool.execute(
          `SELECT gtin FROM products p
           JOIN companies c ON p.company_id = c.id
           WHERE p.gtin = ? AND p.is_hidden = FALSE AND c.is_deactivated = FALSE`,
          [cleanGtin]
        );

        const isValid = rows.length > 0;
        results.push({ gtin: cleanGtin, valid: isValid });

        if (!isValid) {
          allValid = false;
        }
      }
    }

    res.json({
      results,
      allValid
    });
  } catch (error) {
    console.error('Error verifying GTINs:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Public product page API
router.get('/public/:gtin', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT p.*, c.* FROM products p
       JOIN companies c ON p.company_id = c.id
       WHERE p.gtin = ? AND p.is_hidden = FALSE AND c.is_deactivated = FALSE`,
      [req.params.gtin]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(formatProductResponse(rows[0]));
  } catch (error) {
    console.error('Error fetching public product:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// JSON API endpoints (matching the specification)
router.get('/:seatNumber/products.json', async (req, res) => {
  // Redirect to main products API
  const queryString = req.url.split('?')[1] || '';
  res.redirect(`/api/products?${queryString}`);
});

router.get('/:seatNumber/products/:gtin.json', async (req, res) => {
  // Redirect to main product API
  res.redirect(`/api/products/${req.params.gtin}`);
});

module.exports = router;
