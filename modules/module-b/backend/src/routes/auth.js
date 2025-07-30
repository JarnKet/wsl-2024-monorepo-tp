const express = require('express');
const router = express.Router();

// Login
router.post('/login', (req, res) => {
  const { passphrase } = req.body;

  if (passphrase === 'admin') {
    req.session.authenticated = true;
    req.session.save(); // Save the session
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid passphrase' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy(); // Destroy the session
  res.json({ success: true });
});

// Check authentication status
router.get('/status', (req, res) => {
  res.json({ authenticated: !!req.session.authenticated });
});

module.exports = router;
