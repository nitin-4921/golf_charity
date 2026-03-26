const Draw = require('../models/Draw');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');
const { generateRandomDraw, generateAlgorithmicDraw, findWinners } = require('../services/drawEngine');
const { calculateTotalPool, calculatePrizes } = require('../services/prizeCalculator');
const { sendDrawResults, sendWinnerNotification } = require('../services/emailService');

// Subscription fees in pence — should match your Stripe prices
const MONTHLY_FEE = parseInt(process.env.MONTHLY_FEE_PENCE || '999', 10);
const YEARLY_FEE = parseInt(process.env.YEARLY_FEE_PENCE || '9999', 10);

/**
 * POST /api/draws/run
 * Admin: Runs a draw (simulation or real).
 */
exports.runDraw = async (req, res, next) => {
  try {
    const { drawType = 'random', isSimulation = false } = req.body;

    // Generate numbers
    const generatedNumbers =
      drawType === 'algorithm'
        ? await generateAlgorithmicDraw()
        : generateRandomDraw();

    // Find winners
    const winners = await findWinners(generatedNumbers);

    // Calculate prize pools
    const totalPool = await calculateTotalPool(MONTHLY_FEE, YEARLY_FEE);
    const {
      jackpotPool,
      fourMatchPool,
      threeMatchPool,
      jackpotRolledOver,
      rolledOverAmount,
      winnerEntries,
    } = await calculatePrizes(totalPool, winners);

    const totalParticipants = await User.countDocuments({
      subscriptionStatus: 'active',
      'scores.0': { $exists: true },
    });

    const draw = await Draw.create({
      drawDate: new Date(),
      generatedNumbers,
      drawType,
      resultsPublished: false,
      totalPool,
      jackpotPool,
      fourMatchPool,
      threeMatchPool,
      jackpotRolledOver,
      rolledOverAmount,
      totalParticipants,
      winners: winnerEntries,
      isSimulation,
    });

    sendSuccess(res, 201, isSimulation ? 'Simulation complete.' : 'Draw run successfully.', { draw });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/draws/:id/publish
 * Admin: Publishes draw results and notifies winners.
 */
exports.publishDraw = async (req, res, next) => {
  try {
    const draw = await Draw.findById(req.params.id);
    if (!draw) return next(new AppError('Draw not found.', 404));
    if (draw.resultsPublished) return next(new AppError('Draw already published.', 400));
    if (draw.isSimulation) return next(new AppError('Cannot publish a simulation draw.', 400));

    draw.resultsPublished = true;
    draw.publishedAt = new Date();
    await draw.save();

    // Notify all active subscribers of draw results
    const subscribers = await User.find({ subscriptionStatus: 'active' });
    subscribers.forEach((user) => sendDrawResults(user, draw));

    // Notify winners
    for (const entry of draw.winners) {
      const winner = await User.findById(entry.userId);
      if (winner) sendWinnerNotification(winner, entry.matchCount, entry.prizeAmount);
    }

    sendSuccess(res, 200, 'Draw published and notifications sent.', { draw });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/draws
 * Public: Returns published draws (paginated).
 */
exports.getPublishedDraws = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const [draws, total] = await Promise.all([
      Draw.find({ resultsPublished: true, isSimulation: false })
        .sort({ drawDate: -1 })
        .skip(skip)
        .limit(limit)
        .select('-winners.adminNote'),
      Draw.countDocuments({ resultsPublished: true, isSimulation: false }),
    ]);

    sendSuccess(res, 200, 'Draws retrieved.', { draws, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/draws/:id
 */
exports.getDrawById = async (req, res, next) => {
  try {
    const draw = await Draw.findById(req.params.id).populate('winners.userId', 'name');
    if (!draw || (!draw.resultsPublished && req.user?.role !== 'admin')) {
      return next(new AppError('Draw not found.', 404));
    }
    sendSuccess(res, 200, 'Draw retrieved.', { draw });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/draws/my-results
 * User: Returns draws where the authenticated user won.
 */
exports.getMyDrawResults = async (req, res, next) => {
  try {
    const draws = await Draw.find({
      resultsPublished: true,
      isSimulation: false,
      'winners.userId': req.user._id,
    }).sort({ drawDate: -1 });

    const results = draws.map((draw) => {
      const myEntry = draw.winners.find((w) => w.userId.toString() === req.user._id.toString());
      return {
        drawId: draw._id,
        drawDate: draw.drawDate,
        generatedNumbers: draw.generatedNumbers,
        matchCount: myEntry?.matchCount,
        prizeAmount: myEntry?.prizeAmount,
        verificationStatus: myEntry?.verificationStatus,
      };
    });

    sendSuccess(res, 200, 'Your draw results retrieved.', { results });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/draws/:drawId/verify
 * User: Uploads proof for a won draw.
 */
exports.submitProof = async (req, res, next) => {
  try {
    const { proofUrl } = req.body;
    const draw = await Draw.findById(req.params.drawId);
    if (!draw) return next(new AppError('Draw not found.', 404));

    const entry = draw.winners.find((w) => w.userId.toString() === req.user._id.toString());
    if (!entry) return next(new AppError('You are not a winner in this draw.', 403));
    if (entry.verificationStatus !== 'pending') {
      return next(new AppError('Proof already submitted or processed.', 400));
    }

    entry.proofUrl = proofUrl;
    await draw.save();

    sendSuccess(res, 200, 'Proof submitted. Awaiting admin review.', { verificationStatus: entry.verificationStatus });
  } catch (err) {
    next(err);
  }
};
