const { getPool } = require("../config/db");

/**
 * Create all necessary tables with foreign key relationships
 */
async function createTables() {
  const pool = getPool();

  try {
    // Create countries table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS countries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✓ Table "countries" ready');

    // Create divisions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS divisions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        country_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE,
        INDEX idx_country (country_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✓ Table "divisions" ready');

    // Create districts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS districts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        division_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (division_id) REFERENCES divisions(id) ON DELETE CASCADE,
        INDEX idx_division (division_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✓ Table "districts" ready');

    // Create cities table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        district_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE CASCADE,
        INDEX idx_district (district_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✓ Table "cities" ready');

    console.log("✓ All tables created successfully");
  } catch (error) {
    console.error("✗ Error creating tables:", error.message);
    throw error;
  }
}

/**
 * Insert sample data if tables are empty (for development)
 */
async function insertSampleData() {
  const pool = getPool();

  try {
    // Check if countries table has data
    const [countries] = await pool.query(
      "SELECT COUNT(*) as count FROM countries",
    );

    if (countries[0].count > 0) {
      console.log("✓ Sample data already exists");
      return;
    }

    console.log("Inserting sample data...");

    // Insert countries
    const [countryResult] = await pool.query(`
      INSERT INTO countries (name) VALUES 
      ('Bangladesh'),
      ('India'),
      ('Pakistan')
    `);

    // Insert divisions for Bangladesh
    await pool.query(`
      INSERT INTO divisions (name, country_id) VALUES 
      ('Dhaka', 1),
      ('Chittagong', 1),
      ('Rajshahi', 1),
      ('Khulna', 1),
      ('Sylhet', 1),
      ('Barisal', 1),
      ('Rangpur', 1),
      ('Mymensingh', 1)
    `);

    // Insert divisions for India
    await pool.query(`
      INSERT INTO divisions (name, country_id) VALUES 
      ('West Bengal', 2),
      ('Maharashtra', 2),
      ('Karnataka', 2),
      ('Tamil Nadu', 2)
    `);

    // Insert divisions for Pakistan
    await pool.query(`
      INSERT INTO divisions (name, country_id) VALUES 
      ('Punjab', 3),
      ('Sindh', 3),
      ('Khyber Pakhtunkhwa', 3)
    `);

    // Insert districts for Dhaka division
    await pool.query(`
      INSERT INTO districts (name, division_id) VALUES 
      ('Dhaka', 1),
      ('Gazipur', 1),
      ('Narayanganj', 1),
      ('Tangail', 1),
      ('Manikganj', 1)
    `);

    // Insert districts for Chittagong division
    await pool.query(`
      INSERT INTO districts (name, division_id) VALUES 
      ('Chittagong', 2),
      ('Cox\'s Bazar', 2),
      ('Comilla', 2),
      ('Noakhali', 2)
    `);

    // Insert cities/upazilas for Dhaka district
    await pool.query(`
      INSERT INTO cities (name, district_id) VALUES 
      ('Dhaka Sadar', 1),
      ('Mirpur', 1),
      ('Gulshan', 1),
      ('Mohammadpur', 1),
      ('Dhanmondi', 1)
    `);

    // Insert cities for Gazipur district
    await pool.query(`
      INSERT INTO cities (name, district_id) VALUES 
      ('Gazipur Sadar', 2),
      ('Kaliakair', 2),
      ('Kapasia', 2),
      ('Sreepur', 2)
    `);

    // Insert cities for Chittagong district
    await pool.query(`
      INSERT INTO cities (name, district_id) VALUES 
      ('Chittagong Sadar', 6),
      ('Patiya', 6),
      ('Sitakunda', 6),
      ('Rangunia', 6)
    `);

    console.log("✓ Sample data inserted successfully");
  } catch (error) {
    console.error("✗ Error inserting sample data:", error.message);
    throw error;
  }
}

/**
 * Initialize database schema
 */
async function initializeSchema() {
  try {
    await createTables();
    // Sample data seeding disabled - add your own data via SQL or API
    // await insertSampleData();
    console.log("✓ Database schema initialized");
  } catch (error) {
    console.error("✗ Schema initialization failed:", error.message);
    throw error;
  }
}

module.exports = {
  createTables,
  insertSampleData,
  initializeSchema,
};
