/**
 * API Module - Handles all API communications with the backend
 */

const API = (() => {
  const BASE_URL = "/api";

  /**
   * Generic fetch wrapper with error handling
   */
  async function fetchData(endpoint) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "API request failed");
      }

      return data.data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  /**
   * Get all countries
   */
  async function getCountries() {
    return fetchData("/countries");
  }

  /**
   * Get divisions by country ID
   */
  async function getDivisions(countryId) {
    if (!countryId) {
      throw new Error("Country ID is required");
    }
    return fetchData(`/divisions/${countryId}`);
  }

  /**
   * Get districts by division ID
   */
  async function getDistricts(divisionId) {
    if (!divisionId) {
      throw new Error("Division ID is required");
    }
    return fetchData(`/districts/${divisionId}`);
  }

  /**
   * Get cities by district ID
   */
  async function getCities(districtId) {
    if (!districtId) {
      throw new Error("District ID is required");
    }
    return fetchData(`/cities/${districtId}`);
  }

  // Public API
  return {
    getCountries,
    getDivisions,
    getDistricts,
    getCities,
  };
})();
