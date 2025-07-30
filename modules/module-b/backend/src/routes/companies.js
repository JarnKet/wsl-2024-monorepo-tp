const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { requireAuth } = require('../middleware/auth');
const { validateEmail } = require('../utils/validation');

// Get all companies
router.get('/', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM companies ORDER BY company_name');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get active companies
router.get('/active', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM companies WHERE is_deactivated = FALSE ORDER BY company_name');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching active companies:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get deactivated companies
router.get('/deactivated', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM companies WHERE is_deactivated = TRUE ORDER BY company_name');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching deactivated companies:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get single company
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM companies WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get company products
router.get('/:id/products', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM products WHERE company_id = ? ORDER BY name_en', [req.params.id]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching company products:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Create company
router.post('/', requireAuth, async (req, res) => {
  const {
    company_name, address, telephone, email,
    owner_name, owner_mobile, owner_email,
    contact_name, contact_mobile, contact_email
  } = req.body;

  // Validation
  if (!validateEmail(email) || !validateEmail(owner_email) || !validateEmail(contact_email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO companies (
        company_name, address, telephone, email,
        owner_name, owner_mobile, owner_email,
        contact_name, contact_mobile, contact_email
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [company_name, address, telephone, email,
       owner_name, owner_mobile, owner_email,
       contact_name, contact_mobile, contact_email]
    );

    res.status(201).json({ id: result.insertId, message: 'Company created successfully' });
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update company
router.put('/:id', requireAuth, async (req, res) => {
  const {
    company_name, address, telephone, email,
    owner_name, owner_mobile, owner_email,
    contact_name, contact_mobile, contact_email, is_deactivated
  } = req.body;

  // Validation
  if (!validateEmail(email) || !validateEmail(owner_email) || !validateEmail(contact_email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    const [result] = await pool.execute(
      `UPDATE companies SET
        company_name = ?, address = ?, telephone = ?, email = ?,
        owner_name = ?, owner_mobile = ?, owner_email = ?,
        contact_name = ?, contact_mobile = ?, contact_email = ?, is_deactivated = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [company_name, address, telephone, email,
       owner_name, owner_mobile, owner_email,
       contact_name, contact_mobile, contact_email, is_deactivated,
       req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json({ message: 'Company updated successfully' });
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
