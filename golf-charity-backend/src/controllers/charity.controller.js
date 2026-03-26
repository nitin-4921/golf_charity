const Charity = require('../models/Charity');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * GET /api/charities
 * Public: List charities with optional search/filter.
 */
exports.getCharities = async (req, res, next) => {
  try {
    const { search, featured } = req.query;
    const filter = { isActive: true };

    if (search) filter.$text = { $search: search };
    if (featured === 'true') filter.isFeatured = true;

    const charities = await Charity.find(filter).sort({ isFeatured: -1, name: 1 });
    sendSuccess(res, 200, 'Charities retrieved.', { charities });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/charities/:id
 */
exports.getCharityById = async (req, res, next) => {
  try {
    const charity = await Charity.findById(req.params.id);
    if (!charity || !charity.isActive) return next(new AppError('Charity not found.', 404));
    sendSuccess(res, 200, 'Charity retrieved.', { charity });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/charities — Admin only
 */
exports.createCharity = async (req, res, next) => {
  try {
    const charity = await Charity.create(req.body);
    sendSuccess(res, 201, 'Charity created.', { charity });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/charities/:id — Admin only
 */
exports.updateCharity = async (req, res, next) => {
  try {
    const charity = await Charity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!charity) return next(new AppError('Charity not found.', 404));
    sendSuccess(res, 200, 'Charity updated.', { charity });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/charities/:id — Admin only (soft delete)
 */
exports.deleteCharity = async (req, res, next) => {
  try {
    const charity = await Charity.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!charity) return next(new AppError('Charity not found.', 404));
    sendSuccess(res, 200, 'Charity deactivated.');
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/charities/select — User selects their charity
 */
exports.selectCharity = async (req, res, next) => {
  try {
    const { charityId, contributionPercentage } = req.body;

    const charity = await Charity.findById(charityId);
    if (!charity || !charity.isActive) return next(new AppError('Charity not found.', 404));

    const percentage = contributionPercentage || 10;
    if (percentage < 10 || percentage > 100) {
      return next(new AppError('Contribution percentage must be between 10 and 100.', 400));
    }

    await User.findByIdAndUpdate(req.user._id, {
      charityId,
      charityContributionPercentage: percentage,
    });

    sendSuccess(res, 200, 'Charity selection updated.', { charityId, contributionPercentage: percentage });
  } catch (err) {
    next(err);
  }
};
