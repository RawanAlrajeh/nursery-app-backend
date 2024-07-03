const jwt = require('jsonwebtoken');
const { tokenBlacklist } = require('../services/tokenService');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  if (tokenBlacklist.includes(token)) {
    return res.status(401).json({ message: 'Token is invalid' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("Decoded user:", req.user); // Debugging line
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

const authorize = (roles) => {
  return (req, res, next) => {
    console.log("User role:", req.user.role); // Debugging line
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. You do not have the required role.' });
    }
    next();
  };
};

module.exports = { authenticate, authorize, tokenBlacklist };
