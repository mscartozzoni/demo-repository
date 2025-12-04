const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Attach user info to request
      req.user = {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role
      };

      next();
    } catch (jwtError) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
};

// Middleware to check if user has required role
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied',
        message: `This route requires one of these roles: ${allowedRoles.join(', ')}` 
      });
    }

    next();
  };
};

// Middleware to verify admin role
const requireAdmin = checkRole('admin');

// Middleware to verify doctor role
const requireDoctor = checkRole('doctor', 'admin');

// Middleware to verify secretary role
const requireSecretary = checkRole('secretary', 'admin');

module.exports = {
  auth,
  checkRole,
  requireAdmin,
  requireDoctor,
  requireSecretary
};
