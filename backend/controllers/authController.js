// =====================================================
// controllers/authController.js
// Handles registration & login business logic:
// - hashing/comparing passwords with bcrypt
// - issuing JWT tokens on successful login/registration
// =====================================================

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { findUserByEmail, createUser } = require('../models/userModel');

const SALT_ROUNDS = 10;

// Helper: generate a signed JWT for a given user payload
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
};

// @route  POST /api/register
// @desc   Register a new user
// @access Public
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ---- Basic server-side validation (backend must never trust the client) ----
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // ---- Check for duplicate email ----
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    // ---- Hash password & create user ----
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const userId = await createUser(name, email, hashedPassword);

    const token = generateToken({ id: userId, name, email });

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: { id: userId, name, email },
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error during registration' });
  }
};

// @route  POST /api/login
// @desc   Authenticate user & return JWT
// @access Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      // Same message as wrong-password case to avoid leaking which emails exist
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error during login' });
  }
};

module.exports = { register, login };
