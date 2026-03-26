const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUser,
  editUserScores,
  getWinnersForReview,
  verifyWinner,
  markPaid,
  getAnalytics,
} = require('../controllers/admin.controller');
const { protect, restrictTo } = require('../middleware/auth');
const { validate, adminVerifySchema } = require('../utils/validators');

router.use(protect, restrictTo('admin'));

// Users
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.put('/users/:id/scores', editUserScores);

// Winners
router.get('/winners', getWinnersForReview);
router.put('/draws/:drawId/winners/:winnerId/verify', validate(adminVerifySchema), verifyWinner);
router.put('/draws/:drawId/winners/:winnerId/paid', markPaid);

// Analytics
router.get('/analytics', getAnalytics);

module.exports = router;
