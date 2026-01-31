/**
 * Main Application Logic - Handles dropdown cascading and user interactions
 */

// DOM Elements
const elements = {
  country: document.getElementById("country"),
  division: document.getElementById("division"),
  district: document.getElementById("district"),
  city: document.getElementById("city"),
  submitBtn: document.getElementById("submitBtn"),
  resetBtn: document.getElementById("resetBtn"),
  locationForm: document.getElementById("locationForm"),
  selectedLocation: document.getElementById("selectedLocation"),
  loadingOverlay: document.getElementById("loadingOverlay"),
};

// Selected values display elements
const selectedDisplay = {
  country: document.getElementById("selectedCountry"),
  division: document.getElementById("selectedDivision"),
  district: document.getElementById("selectedDistrict"),
  city: document.getElementById("selectedCity"),
};

// State management
const state = {
  selectedCountry: null,
  selectedDivision: null,
  selectedDistrict: null,
  selectedCity: null,
};

/**
 * Show loading overlay
 */
function showLoading() {
  elements.loadingOverlay.classList.add("active");
}

/**
 * Hide loading overlay
 */
function hideLoading() {
  elements.loadingOverlay.classList.remove("active");
}

/**
 * Populate dropdown with options
 */
function populateDropdown(selectElement, data, placeholder) {
  selectElement.innerHTML = `<option value="">${placeholder}</option>`;

  data.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.name;
    selectElement.appendChild(option);
  });
}

/**
 * Reset dropdown to initial state
 */
function resetDropdown(selectElement, placeholder, disabled = true) {
  selectElement.innerHTML = `<option value="">${placeholder}</option>`;
  selectElement.disabled = disabled;
  selectElement.value = "";
}

/**
 * Reset all child dropdowns
 */
function resetChildDropdowns(level) {
  const levels = ["division", "district", "city"];
  const startIndex = levels.indexOf(level);

  if (startIndex !== -1) {
    for (let i = startIndex; i < levels.length; i++) {
      const levelName = levels[i];
      resetDropdown(
        elements[levelName],
        `Select ${i === 0 ? "country" : levels[i - 1]} first`,
        true,
      );
      state[
        `selected${levelName.charAt(0).toUpperCase() + levelName.slice(1)}`
      ] = null;
    }
  }

  // Disable submit button
  elements.submitBtn.disabled = true;

  // Hide selected location display
  elements.selectedLocation.style.display = "none";
}

/**
 * Load countries on page load
 */
async function loadCountries() {
  try {
    showLoading();
    const countries = await API.getCountries();

    if (countries.length === 0) {
      populateDropdown(elements.country, [], "No countries available");
      alert("No countries found in database. Please add sample data.");
      return;
    }

    populateDropdown(elements.country, countries, "Select a country");
    elements.country.disabled = false;
  } catch (error) {
    console.error("Failed to load countries:", error);
    populateDropdown(elements.country, [], "Failed to load countries");
    alert(
      "Failed to load countries. Please check your connection and try again.",
    );
  } finally {
    hideLoading();
  }
}

/**
 * Handle country selection
 */
async function handleCountryChange(event) {
  const countryId = event.target.value;
  const countryName = event.target.options[event.target.selectedIndex].text;

  // Reset all child dropdowns
  resetChildDropdowns("division");

  if (!countryId) {
    state.selectedCountry = null;
    return;
  }

  state.selectedCountry = { id: countryId, name: countryName };

  try {
    showLoading();
    const divisions = await API.getDivisions(countryId);

    if (divisions.length === 0) {
      resetDropdown(elements.division, "No divisions available", true);
      alert("No divisions found for selected country.");
      return;
    }

    populateDropdown(elements.division, divisions, "Select a division");
    elements.division.disabled = false;
  } catch (error) {
    console.error("Failed to load divisions:", error);
    resetDropdown(elements.division, "Failed to load divisions", true);
    alert("Failed to load divisions. Please try again.");
  } finally {
    hideLoading();
  }
}

/**
 * Handle division selection
 */
async function handleDivisionChange(event) {
  const divisionId = event.target.value;
  const divisionName = event.target.options[event.target.selectedIndex].text;

  // Reset child dropdowns
  resetChildDropdowns("district");

  if (!divisionId) {
    state.selectedDivision = null;
    return;
  }

  state.selectedDivision = { id: divisionId, name: divisionName };

  try {
    showLoading();
    const districts = await API.getDistricts(divisionId);

    if (districts.length === 0) {
      resetDropdown(elements.district, "No districts available", true);
      alert("No districts found for selected division.");
      return;
    }

    populateDropdown(elements.district, districts, "Select a district");
    elements.district.disabled = false;
  } catch (error) {
    console.error("Failed to load districts:", error);
    resetDropdown(elements.district, "Failed to load districts", true);
    alert("Failed to load districts. Please try again.");
  } finally {
    hideLoading();
  }
}

/**
 * Handle district selection
 */
async function handleDistrictChange(event) {
  const districtId = event.target.value;
  const districtName = event.target.options[event.target.selectedIndex].text;

  // Reset child dropdowns
  resetChildDropdowns("city");

  if (!districtId) {
    state.selectedDistrict = null;
    return;
  }

  state.selectedDistrict = { id: districtId, name: districtName };

  try {
    showLoading();
    const cities = await API.getCities(districtId);

    if (cities.length === 0) {
      resetDropdown(elements.city, "No cities available", true);
      alert("No cities found for selected district.");
      return;
    }

    populateDropdown(elements.city, cities, "Select a city/upazila");
    elements.city.disabled = false;
  } catch (error) {
    console.error("Failed to load cities:", error);
    resetDropdown(elements.city, "Failed to load cities", true);
    alert("Failed to load cities. Please try again.");
  } finally {
    hideLoading();
  }
}

/**
 * Handle city selection
 */
function handleCityChange(event) {
  const cityId = event.target.value;
  const cityName = event.target.options[event.target.selectedIndex].text;

  if (!cityId) {
    state.selectedCity = null;
    elements.submitBtn.disabled = true;
    elements.selectedLocation.style.display = "none";
    return;
  }

  state.selectedCity = { id: cityId, name: cityName };

  // Enable submit button when all selections are made
  elements.submitBtn.disabled = false;
}

/**
 * Handle form submission
 */
function handleSubmit(event) {
  event.preventDefault();

  // Validate all selections
  if (
    !state.selectedCountry ||
    !state.selectedDivision ||
    !state.selectedDistrict ||
    !state.selectedCity
  ) {
    alert("Please complete all selections");
    return;
  }

  // Display selected location
  selectedDisplay.country.textContent = state.selectedCountry.name;
  selectedDisplay.division.textContent = state.selectedDivision.name;
  selectedDisplay.district.textContent = state.selectedDistrict.name;
  selectedDisplay.city.textContent = state.selectedCity.name;

  elements.selectedLocation.style.display = "block";

  // Scroll to results
  elements.selectedLocation.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
  });

  // Log selection (for demonstration)
  console.log("Selected Location:", {
    country: state.selectedCountry,
    division: state.selectedDivision,
    district: state.selectedDistrict,
    city: state.selectedCity,
  });
}

/**
 * Handle form reset
 */
function handleReset() {
  // Reset form
  elements.locationForm.reset();

  // Reset all dropdowns except country
  resetChildDropdowns("division");

  // Reset state
  state.selectedCountry = null;
  state.selectedDivision = null;
  state.selectedDistrict = null;
  state.selectedCity = null;

  // Hide selected location display
  elements.selectedLocation.style.display = "none";

  // Reload countries
  loadCountries();
}

/**
 * Initialize event listeners
 */
function initEventListeners() {
  elements.country.addEventListener("change", handleCountryChange);
  elements.division.addEventListener("change", handleDivisionChange);
  elements.district.addEventListener("change", handleDistrictChange);
  elements.city.addEventListener("change", handleCityChange);
  elements.locationForm.addEventListener("submit", handleSubmit);
  elements.resetBtn.addEventListener("click", handleReset);
}

/**
 * Initialize the application
 */
function init() {
  console.log("🚀 Application initialized");
  initEventListeners();
  loadCountries();
}

// Start the application when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
