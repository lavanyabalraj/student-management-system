// =====================================================
// config/db.js
// Creates a MySQL connection pool using credentials
// from the .env file. Exported pool is reused across
// the whole app (models use pool.execute / pool.query).
// =====================================================

const mysql = require('mysql2/promise');
require('dotenv').config();

console.log(process.env.DB_USER);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Quick sanity check on startup so connection issues are obvious immediately
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL connected successfully');
    connection.release();
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
  }
})();

module.exports = pool;
