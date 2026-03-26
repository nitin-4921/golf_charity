const User = require('../models/User');
const Draw = require('../models/Draw');
const Donation = require('../models/Donation');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * GET /api/users/dashboard
 * Returns full dashboard data for the authenticated user.
 */
exports.getDashboard = async (req, res, next) => {
  try {
    const user = req.user;

    // Scores sorted latest first
    const scores = [...user.scores].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Draws the user participated in (had scores at draw time)
    const participatedDraws = await Draw.find({
      resultsPublished: true,
      isSimulation: false,
    })
      .sort({ drawDate: -1 })
      .limit(6)
      .select('drawDate generatedNumbers totalPool resultsPublished');

    // User's winnings
    const winningDraws = await Draw.find({
      resultsPublished: true,
      isSimulation: false,
      'winners.userId': user._id,
    }).sort({ drawDate: -1 });

    const winnings = winningDraws.map((draw) => {
      const entry = draw.winners.find((w) => w.userId.toString() === user._id.toString());
      return {
        drawId: draw._id,
        drawDate: draw.drawDate,
        matchCount: entry?.matchCount,
        prizeAmount: entry?.prizeAmount,
        verificationStatus: entry?.verificationStatus,
      };
    });

    const totalWon = winnings
      .filter((w) => w.verificationStatus === 'paid')
      .reduce((sum, w) => sum + w.prizeAmount, 0);

    // Donation history
    const donations = await Donation.find({ userId: user._id })
      .populate('charityId', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    sendSuccess(res, 200, 'Dashboard data retrieved.', {
      profile: {
        name: user.name,
        email: user.email,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionEndDate: user.subscriptionEndDate,
      },
      scores,
      charity: {
        selected: user.charityId,
        contributionPercentage: user.charityContributionPercentage,
      },
      draws: {
        recent: participatedDraws,
        winnings,
        totalWon,
      },
      donations,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/users/profile
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name }, { new: true, runValidators: true });
    sendSuccess(res, 200, 'Profile updated.', { user });
  } catch (err) {
    next(err);
  }
};
