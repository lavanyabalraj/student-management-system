// =====================================================
// server.js
// Entry point of the backend application.
// Sets up Express, middleware, routes, and starts
// listening on the configured port.
// =====================================================

const express = require('express');
const cors = require('cors');
require('dotenv').config();

require('./config/db'); // establishes MySQL pool + logs connection status

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');

const app = express();

// ---- Global middleware ----
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json()); // parse JSON request bodies

// ---- Health check ----
app.get('/', (req, res) => {
  res.json({ message: 'Student Management System API is running' });
});

// ---- Routes ----
app.use('/api', authRoutes);          // /api/register, /api/login
app.use('/api/students', studentRoutes); // /api/students/*

// ---- 404 handler ----
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ---- Global error handler (catches anything unexpected) ----
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
