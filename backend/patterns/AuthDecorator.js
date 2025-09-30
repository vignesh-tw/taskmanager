const jwt = require('jsonwebtoken');
const { promisify } = require('util');

/**
 * Decorator Pattern implementation for JWT authentication
 * Provides modular authentication and authorization functionality
 */

// Base Controller decorator
class ControllerDecorator {
  constructor(controller) {
    this.controller = controller;
  }

  async execute(...args) {
    return this.controller.execute(...args);
  }
}

// Authentication Decorator
class AuthenticationDecorator extends ControllerDecorator {
  async execute(req, res, next) {
    try {
      // Check for token in headers
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({
          status: 'error',
          message: 'Authentication required'
        });
      }

      // Verify token
      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET
      );

      // Add user info to request
      req.user = decoded;

      // Call the wrapped controller
      return this.controller.execute(req, res, next);
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid token'
        });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          status: 'error',
          message: 'Token expired'
        });
      }
      return res.status(500).json({
        status: 'error',
        message: 'Authentication error'
      });
    }
  }
}

// Role Authorization Decorator
class RoleAuthorizationDecorator extends ControllerDecorator {
  constructor(controller, allowedRoles) {
    super(controller);
    this.allowedRoles = allowedRoles;
  }

  async execute(req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'Authentication required'
        });
      }

      if (!this.allowedRoles.includes(req.user.userType)) {
        return res.status(403).json({
          status: 'error',
          message: 'Unauthorized access'
        });
      }

      return this.controller.execute(req, res, next);
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Authorization error'
      });
    }
  }
}

// Resource Owner Authorization Decorator
class ResourceOwnerDecorator extends ControllerDecorator {
  constructor(controller, resourceIdPath) {
    super(controller);
    this.resourceIdPath = resourceIdPath;
  }

  async execute(req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'Authentication required'
        });
      }

      // Get resource ID from request based on path
      const resourceId = this.resourceIdPath.split('.').reduce((obj, key) => obj[key], req);

      // Check if user owns the resource
      const isOwner = await this.checkResourceOwnership(req.user.id, resourceId);
      
      if (!isOwner) {
        return res.status(403).json({
          status: 'error',
          message: 'Unauthorized access to resource'
        });
      }

      return this.controller.execute(req, res, next);
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Resource authorization error'
      });
    }
  }

  async checkResourceOwnership(userId, resourceId) {
    // Implementation would check if user owns the resource
    // This would be customized based on the resource type
    return true; // Placeholder
  }
}

// Utility function to compose decorators
function composeDecorators(...decorators) {
  return (controller) => {
    return decorators.reduceRight((decorated, Decorator) => {
      return new Decorator(decorated);
    }, controller);
  };
}

// Example usage:
// const protectedController = composeDecorators(
//   AuthenticationDecorator,
//   new RoleAuthorizationDecorator(['admin', 'therapist']),
//   new ResourceOwnerDecorator('params.id')
// )(originalController);

module.exports = {
  AuthenticationDecorator,
  RoleAuthorizationDecorator,
  ResourceOwnerDecorator,
  composeDecorators
};