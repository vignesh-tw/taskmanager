// Import the new decorator-based authentication
const {
  AuthDecorator,
  protect,
  requireAuth,
  requireTherapist,
  requirePatient,
  optionalAuth,
} = require("./authDecorator");

// Export both old and new interfaces for compatibility
module.exports = {
  protect,
  AuthDecorator,
  requireAuth,
  requireTherapist,
  requirePatient,
  optionalAuth,
};
