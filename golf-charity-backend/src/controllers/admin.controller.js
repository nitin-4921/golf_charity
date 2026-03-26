const User = require('../models/User');
const Draw = require('../models/Draw');
const Charity = require('../models/Charity');
const Donation = require('../models/Donation');
const JackpotRollover = require('../models/JackpotRollover');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');

// ── User Management ──

exports.getUsers = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.subscriptionStatus = status;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [users, total] = await Promise.all([
      User.find(filter).populate('charityId', 'name').skip(skip).limit(parseInt(limit, 10)).sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);

    sendSuccess(res, 200, 'Users retrieved.', { users, total, page: parseInt(page, 10), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate('charityId', 'name image');
    if (!user) return next(new AppError('User not found.', 404));
    sendSuccess(res, 200, 'User retrieved.', { user });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    // Prevent password update via this route
    const { password, ...updateData } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!user) return next(new AppError('User not found.', 404));
    sendSuccess(res, 200, 'User updated.', { user });
  } catch (err) {
    next(err);
  }
};

exports.editUserScores = async (req, res, next) => {
  try {
    const { scores } = req.body; // array of { value, date }
    if (!Array.isArray(scores) || scores.length > 5) {
      return next(new AppError('Provide up to 5 scores.', 400));
    }

    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError('User not found.', 404));

    user.scores = scores.map((s) => ({ value: s.value, date: new Date(s.date) }));
    await user.save();

    sendSuccess(res, 200, 'User scores updated.', { scores: user.scores });
  } catch (err) {
    next(err);
  }
};

// ── Winner Verification ──

exports.getWinnersForReview = async (req, res, next) => {
  try {
    const draws = await Draw.find({
      resultsPublished: true,
      'winners.verificationStatus': { $in: ['pending', 'approved'] },
    }).populate('winners.userId', 'name email');

    const pending = [];
    draws.forEach((draw) => {
      draw.winners.forEach((w) => {
        if (['pending', 'approved'].includes(w.verificationStatus)) {
          pending.push({
            drawId: draw._id,
            drawDate: draw.drawDate,
            winnerId: w._id,
            user: w.userId,
            matchCount: w.matchCount,
            prizeAmount: w.prizeAmount,
            verificationStatus: w.verificationStatus,
            proofUrl: w.proofUrl,
          });
        }
      });
    });

    sendSuccess(res, 200, 'Winners retrieved.', { winners: pending });
  } catch (err) {
    next(err);
  }
};

exports.verifyWinner = async (req, res, next) => {
  try {
    const { drawId, winnerId } = req.params;
    const { status, adminNote } = req.body;

    const draw = await Draw.findById(drawId);
    if (!draw) return next(new AppError('Draw not found.', 404));

    const entry = draw.winners.id(winnerId);
    if (!entry) return next(new AppError('Winner entry not found.', 404));

    entry.verificationStatus = status;
    if (adminNote) entry.adminNote = adminNote;
    await draw.save();

    sendSuccess(res, 200, `Winner ${status}.`, { entry });
  } catch (err) {
    next(err);
  }
};

exports.markPaid = async (req, res, next) => {
  try {
    const { drawId, winnerId } = req.params;
    const draw = await Draw.findById(drawId);
    if (!draw) return next(new AppError('Draw not found.', 404));

    const entry = draw.winners.id(winnerId);
    if (!entry) return next(new AppError('Winner entry not found.', 404));
    if (entry.verificationStatus !== 'approved') {
      return next(new AppError('Winner must be approved before marking as paid.', 400));
    }

    entry.verificationStatus = 'paid';
    await draw.save();

    sendSuccess(res, 200, 'Winner marked as paid.', { entry });
  } catch (err) {
    next(err);
  }
};

// ── Analytics ──

exports.getAnalytics = async (req, res, next) => {
  try {
    const [
      totalUsers,
      activeSubscribers,
      totalCharities,
      charityTotals,
      rollover,
      recentDraws,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ subscriptionStatus: 'active' }),
      Charity.countDocuments({ isActive: true }),
      Donation.aggregate([
        { $group: { _id: '$charityId', total: { $sum: '$amount' } } },
        { $lookup: { from: 'charities', localField: '_id', foreignField: '_id', as: 'charity' } },
        { $unwind: '$charity' },
        { $project: { charityName: '$charity.name', total: 1 } },
      ]),
      JackpotRollover.findOne(),
      Draw.find({ resultsPublished: true, isSimulation: false }).sort({ drawDate: -1 }).limit(5),
    ]);

    const totalDonations = await Donation.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    sendSuccess(res, 200, 'Analytics retrieved.', {
      totalUsers,
      activeSubscribers,
      totalCharities,
      totalDonations: totalDonations[0]?.total || 0,
      charityBreakdown: charityTotals,
      currentJackpotRollover: rollover?.accumulatedAmount || 0,
      recentDraws,
    });
  } catch (err) {
    next(err);
  }
};
