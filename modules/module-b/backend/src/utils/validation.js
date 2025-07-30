/**
 * Validation utility functions
 */

/**
 * Validate GTIN format (13-14 digits)
 * @param {string} gtin - The GTIN to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const validateGTIN = (gtin) => {
  return /^[0-9]{13,14}$/.test(gtin);
};

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Validate weight unit
 * @param {string} unit - The weight unit to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const validateWeightUnit = (unit) => {
  return ['kg', 'g', 'lb', 'oz'].includes(unit);
};

module.exports = {
  validateGTIN,
  validateEmail,
  validateWeightUnit
};
