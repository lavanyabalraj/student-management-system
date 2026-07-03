// =====================================================
// middleware/authMiddleware.js
// Verifies the JWT sent in the Authorization header
// (format: "Bearer <token>"). Attaches decoded user
// info to req.user if valid, otherwise returns 401.
// Used on every protected route (dashboard/students).
// =====================================================

const jwt = require('jsonwebtoken');
require('dotenv').config();

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, name, email }

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
  }
};

module.exports = { protect };
