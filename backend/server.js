const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { createPool, testConnection } = require("./config/db");
const { initializeSchema } = require("./models/schema");
const locationRoutes = require("./routes/locationRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, "../frontend")));

// API Routes
app.use("/api", locationRoutes);

// Root route - serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Initialize database and start server
async function startServer() {
  try {
    console.log("🚀 Starting server...");

    // Create database connection pool
    await createPool();

    // Test connection
    await testConnection();

    // Initialize database schema (create tables and insert sample data)
    await initializeSchema();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`\n✓ Server is running on http://localhost:${PORT}`);
      console.log(`✓ API available at http://localhost:${PORT}/api`);
      console.log("\n📝 Available endpoints:");
      console.log("  GET  /api/countries");
      console.log("  GET  /api/divisions/:countryId");
      console.log("  GET  /api/districts/:divisionId");
      console.log("  GET  /api/cities/:districtId");
      console.log("\n✨ Ready to accept requests!\n");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n🛑 Shutting down gracefully...");
  process.exit(0);
});

// Start the server
startServer();
