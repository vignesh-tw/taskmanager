const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

/**
 * Decorator function that adds JWT authentication to routes
 * Implements the Decorator Pattern for middleware functionality
 */
class AuthDecorator {
  /**
   * Creates a decorator for JWT authentication
   * @param {Object} options - Configuration options for the decorator
   * @param {Array} options.roles - Array of allowed user types (e.g., ['therapist', 'patient'])
   * @param {boolean} options.optional - Whether authentication is optional
   * @returns {Function} Express middleware function
   */
  static authenticate(options = {}) {
    const { roles = [], optional = false } = options;

    return async (req, res, next) => {
      try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          if (optional) {
            req.user = null;
            return next();
          }
          return res.status(401).json({
            message: "Access denied. No token provided.",
          });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
          if (optional) {
            req.user = null;
            return next();
          }
          return res.status(401).json({
            message: "Access denied. Invalid token format.",
          });
        }

        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user and attach to request
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
          return res.status(401).json({
            message: "Access denied. User not found.",
          });
        }

        req.user = user;

        // Check role-based access if roles are specified
        if (roles.length > 0 && !roles.includes(user.userType)) {
          return res.status(403).json({
            message: `Access denied. Required role: ${roles.join(" or ")}. Your role: ${user.userType}`,
          });
        }

        next();
      } catch (error) {
        if (error.name === "JsonWebTokenError") {
          return res.status(401).json({
            message: "Access denied. Invalid token.",
          });
        }
        if (error.name === "TokenExpiredError") {
          return res.status(401).json({
            message: "Access denied. Token expired.",
          });
        }

        return res.status(500).json({
          message: "Internal server error during authentication.",
          error: error.message,
        });
      }
    };
  }

  /**
   * Decorator for routes that require therapist access only
   * @returns {Function} Express middleware function
   */
  static requireTherapist() {
    return AuthDecorator.authenticate({ roles: ["therapist"] });
  }

  /**
   * Decorator for routes that require patient access only
   * @returns {Function} Express middleware function
   */
  static requirePatient() {
    return AuthDecorator.authenticate({ roles: ["patient"] });
  }

  /**
   * Decorator for routes that require any authenticated user
   * @returns {Function} Express middleware function
   */
  static requireAuth() {
    return AuthDecorator.authenticate();
  }

  /**
   * Decorator for routes where authentication is optional
   * @returns {Function} Express middleware function
   */
  static optionalAuth() {
    return AuthDecorator.authenticate({ optional: true });
  }
}

// Export plain functions to avoid context issues when destructured
const requireAuth = () => AuthDecorator.requireAuth();
const requireTherapist = () => AuthDecorator.requireTherapist();
const requirePatient = () => AuthDecorator.requirePatient();
const optionalAuth = () => AuthDecorator.optionalAuth();
const protect = requireAuth();

module.exports = {
  AuthDecorator,
  protect,
  requireAuth,
  requireTherapist,
  requirePatient,
  optionalAuth,
};
