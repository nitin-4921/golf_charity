const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

/**
 * Verifies JWT and attaches user to req.user.
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Authentication required. Please log in.', 401));
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).populate('charityId', 'name image');
    if (!user) {
      return next(new AppError('User no longer exists.', 401));
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') return next(new AppError('Invalid token.', 401));
    if (err.name === 'TokenExpiredError') return next(new AppError('Token expired. Please log in again.', 401));
    next(err);
  }
};

/**
 * Restricts access to specific roles.
 * Usage: restrictTo('admin')
 */
const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError('You do not have permission to perform this action.', 403));
  }
  next();
};

/**
 * Ensures the user has an active subscription.
 */
const requireActiveSubscription = (req, res, next) => {
  if (req.user.subscriptionStatus !== 'active') {
    return next(new AppError('An active subscription is required to access this feature.', 403));
  }
  // Check subscription hasn't expired
  if (req.user.subscriptionEndDate && new Date() > new Date(req.user.subscriptionEndDate)) {
    return next(new AppError('Your subscription has expired. Please renew to continue.', 403));
  }
  next();
};

module.exports = { protect, restrictTo, requireActiveSubscription };
