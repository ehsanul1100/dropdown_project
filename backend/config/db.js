const mysql = require("mysql2/promise");
require("dotenv").config();

let pool = null;

/**
 * Create MySQL connection pool
 */
async function createPool() {
  try {
    // First connection without database to create it if needed
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });

    // Create database if it doesn't exist
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`,
    );
    console.log(`✓ Database '${process.env.DB_NAME}' ready`);

    await connection.end();

    // Now create pool with the database
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    console.log("✓ MySQL connection pool created");
    return pool;
  } catch (error) {
    console.error("✗ Database connection error:", error.message);
    throw error;
  }
}

/**
 * Get database connection pool
 */
function getPool() {
  if (!pool) {
    throw new Error("Database pool not initialized. Call createPool() first.");
  }
  return pool;
}

/**
 * Test database connection
 */
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✓ Database connection test successful");
    connection.release();
    return true;
  } catch (error) {
    console.error("✗ Database connection test failed:", error.message);
    return false;
  }
}

module.exports = {
  createPool,
  getPool,
  testConnection,
};
