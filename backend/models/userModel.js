// =====================================================
// models/userModel.js
// Data-access layer for the `users` table.
// Keeps raw SQL in one place instead of scattering
// queries across controllers (basic MVC separation).
// =====================================================

const pool = require('../config/db');

// Find a user by email (used during login & registration duplicate check)
const findUserByEmail = async (email) => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0]; // undefined if not found
};

// Find a user by id (used to attach user info after JWT verification)
const findUserById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT id, name, email, created_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0];
};

// Insert a new user (password must already be hashed by the controller)
const createUser = async (name, email, hashedPassword) => {
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword]
  );
  return result.insertId;
};

module.exports = { findUserByEmail, findUserById, createUser };
