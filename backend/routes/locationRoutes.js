const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");

// Get all countries
router.get("/countries", locationController.getAllCountries);

// Get divisions by country ID
router.get("/divisions/:countryId", locationController.getDivisionsByCountry);

// Get districts by division ID
router.get("/districts/:divisionId", locationController.getDistrictsByDivision);

// Get cities by district ID
router.get("/cities/:districtId", locationController.getCitiesByDistrict);

module.exports = router;
