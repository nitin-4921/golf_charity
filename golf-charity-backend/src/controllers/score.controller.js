const User = require('../models/User');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * POST /api/scores
 * Adds a new score. Enforces rolling-5 rule.
 */
exports.addScore = async (req, res, next) => {
  try {
    const { value, date } = req.body;
    const user = await User.findById(req.user._id);

    user.addScore(value, new Date(date));
    await user.save();

    sendSuccess(res, 201, 'Score added successfully.', { scores: user.scores });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/scores
 * Returns user's scores sorted latest first.
 */
exports.getScores = async (req, res) => {
  const scores = [...req.user.scores].sort((a, b) => new Date(b.date) - new Date(a.date));
  sendSuccess(res, 200, 'Scores retrieved.', { scores });
};

/**
 * PUT /api/scores/:scoreId
 * Edits an existing score entry.
 */
exports.editScore = async (req, res, next) => {
  try {
    const { value, date } = req.body;
    const user = await User.findById(req.user._id);

    const score = user.scores.id(req.params.scoreId);
    if (!score) return next(new AppError('Score not found.', 404));

    if (value !== undefined) score.value = value;
    if (date !== undefined) score.date = new Date(date);

    await user.save();
    sendSuccess(res, 200, 'Score updated.', { scores: user.scores });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/scores/:scoreId
 */
exports.deleteScore = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const score = user.scores.id(req.params.scoreId);
    if (!score) return next(new AppError('Score not found.', 404));

    score.deleteOne();
    await user.save();
    sendSuccess(res, 200, 'Score deleted.', { scores: user.scores });
  } catch (err) {
    next(err);
  }
};
