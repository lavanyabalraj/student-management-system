// =====================================================
// config/db.js
// Creates a MySQL connection pool using credentials
// from the .env file. Exported pool is reused across
// the whole app (models use pool.execute / pool.query).
// =====================================================

const mysql = require("mysql2/promise");
const fs = require("fs");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 4000,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  ssl: {
    ca: fs.readFileSync("./ca.pem"),
    rejectUnauthorized: false
  }
});

(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ TiDB Connected Successfully");
    conn.release();
  } catch (err) {
    console.error("❌ DB Connection Failed:", err.message);
  }
})();

module.exports = pool;