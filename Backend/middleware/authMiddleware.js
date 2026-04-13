const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = (req, res, next) => {
  let token;

  // Check for token in the Authorization header (Bearer <token>)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user object (without password) to the request
      req.user = decoded.id; // decoded.id holds the user's MongoDB ID
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const restrictTo = (...roles) => (req, res, next) => {
  // Check if the user's role is included in the allowed roles
  // We need to fetch the user object to get the role
  User.findById(req.user)
    .then(user => {
      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({ message: 'Access denied: Insufficient role permissions.' });
      }
      // Attach the full user object to the request for easy access
      req.fullUser = user; 
      next();
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Server error during role check.' });
    });
};

module.exports = { protect, restrictTo };