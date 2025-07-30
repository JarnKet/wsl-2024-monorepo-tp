require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

// Import custom session middleware
const createSessionMiddleware = require('./src/middleware/session');

// Import routes
const authRoutes = require('./src/routes/auth');
const companiesRoutes = require('./src/routes/companies');
const productsRoutes = require('./src/routes/products');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom session middleware
app.use(createSessionMiddleware());

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/products', productsRoutes);

// GTIN verification endpoint (backward compatibility)
app.use('/api/gtin', productsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🖼️  Uploads URL: http://localhost:${PORT}/uploads`);
});

module.exports = app;
