import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ 
        message: 'Not authorized', 
        error: error.message 
      });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // Check if user exists (from protect middleware)
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Check if user's role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role ${req.user.role} is not authorized to access this route` 
      });
    }

    next();
  };
};

// Define role-based permissions
export const canVisit = (req, res, next) => {
  // Visitors, Users, and Admins can access
  if (['visitor', 'user', 'admin'].includes(req.user.role)) {
    return next();
  }
  return res.status(403).json({ message: 'Insufficient permissions' });
};

export const canComment = (req, res, next) => {
  // Users and Admins can comment
  if (['user', 'admin'].includes(req.user.role)) {
    return next();
  }
  return res.status(403).json({ message: 'You need to be a registered user to comment' });
};

export const canEditProfile = (req, res, next) => {
  // Users can edit their own profile, Admins can edit any profile
  if (req.user.role === 'admin' || req.user._id.toString() === req.params.id) {
    return next();
  }
  return res.status(403).json({ message: 'You can only edit your own profile' });
};

export const canManageContent = (req, res, next) => {
  // Only Admins can manage content
  if (req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Only administrators can manage content' });
};
