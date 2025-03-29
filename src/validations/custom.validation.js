/**
 * Custom validation for password
 * @param {string} value
 * @param {Object} helpers
 * @returns {string|Object}
 */
const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('password must be at least 8 characters');
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message('password must contain at least 1 letter and 1 number');
  }
  return value;
};

/**
 * Custom validation for objectId
 * @param {string} value
 * @param {Object} helpers
 * @returns {string|Object}
 */
const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('{{#label}} must be a valid mongo id');
  }
  return value;
};

/**
 * Custom validation for mobile number
 * @param {string} value
 * @param {Object} helpers
 * @returns {string|Object}
 */
const mobileNumber = (value, helpers) => {
  if (!value.match(/^[0-9]{10}$/)) {
    return helpers.message('{{#label}} must be a valid 10-digit mobile number');
  }
  return value;
};

/**
 * Custom validation for URL
 * @param {string} value
 * @param {Object} helpers
 * @returns {string|Object}
 */
const url = (value, helpers) => {
  try {
    // eslint-disable-next-line no-new
    new URL(value);
    return value;
  } catch (error) {
    return helpers.message('{{#label}} must be a valid URL');
  }
};

module.exports = {
  password,
  objectId,
  mobileNumber,
  url,
};