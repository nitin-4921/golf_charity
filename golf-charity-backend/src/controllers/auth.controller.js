const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

/**
 * POST /api/auth/register
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, charityId, charityContributionPercentage } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return next(new AppError('Email already registered.', 409));

    // Only use charityId if it looks like a valid MongoDB ObjectId
    const validCharityId = charityId && /^[a-f\d]{24}$/i.test(charityId) ? charityId : null;

    const user = await User.create({
      name,
      email,
      password,
      charityId: validCharityId,
      charityContributionPercentage: charityContributionPercentage || 10,
    });

    const token = signToken(user._id);
    sendSuccess(res, 201, 'Registration successful.', { token, user });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password').populate('charityId', 'name image');
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Invalid email or password.', 401));
    }

    const token = signToken(user._id);
    sendSuccess(res, 200, 'Login successful.', { token, user });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/me
 */
exports.getMe = async (req, res) => {
  sendSuccess(res, 200, 'User profile retrieved.', { user: req.user });
};
