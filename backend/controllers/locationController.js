const { getPool } = require("../config/db");

/**
 * Get all countries
 */
async function getAllCountries(req, res) {
  try {
    const pool = getPool();
    const [countries] = await pool.query(
      "SELECT id, name FROM countries ORDER BY name",
    );

    res.json({
      success: true,
      data: countries,
    });
  } catch (error) {
    console.error("Error fetching countries:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch countries",
      error: error.message,
    });
  }
}

/**
 * Get divisions by country ID
 */
async function getDivisionsByCountry(req, res) {
  try {
    const { countryId } = req.params;

    if (!countryId || isNaN(countryId)) {
      return res.status(400).json({
        success: false,
        message: "Valid country ID is required",
      });
    }

    const pool = getPool();
    const [divisions] = await pool.query(
      "SELECT id, name FROM divisions WHERE country_id = ? ORDER BY name",
      [countryId],
    );

    res.json({
      success: true,
      data: divisions,
    });
  } catch (error) {
    console.error("Error fetching divisions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch divisions",
      error: error.message,
    });
  }
}

/**
 * Get districts by division ID
 */
async function getDistrictsByDivision(req, res) {
  try {
    const { divisionId } = req.params;

    if (!divisionId || isNaN(divisionId)) {
      return res.status(400).json({
        success: false,
        message: "Valid division ID is required",
      });
    }

    const pool = getPool();
    const [districts] = await pool.query(
      "SELECT id, name FROM districts WHERE division_id = ? ORDER BY name",
      [divisionId],
    );

    res.json({
      success: true,
      data: districts,
    });
  } catch (error) {
    console.error("Error fetching districts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch districts",
      error: error.message,
    });
  }
}

/**
 * Get cities by district ID
 */
async function getCitiesByDistrict(req, res) {
  try {
    const { districtId } = req.params;

    if (!districtId || isNaN(districtId)) {
      return res.status(400).json({
        success: false,
        message: "Valid district ID is required",
      });
    }

    const pool = getPool();
    const [cities] = await pool.query(
      "SELECT id, name FROM cities WHERE district_id = ? ORDER BY name",
      [districtId],
    );

    res.json({
      success: true,
      data: cities,
    });
  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cities",
      error: error.message,
    });
  }
}

module.exports = {
  getAllCountries,
  getDivisionsByCountry,
  getDistrictsByDivision,
  getCitiesByDistrict,
};
