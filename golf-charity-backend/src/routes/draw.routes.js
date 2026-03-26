const router = require('express').Router();
const {
  runDraw,
  publishDraw,
  getPublishedDraws,
  getDrawById,
  getMyDrawResults,
  submitProof,
} = require('../controllers/draw.controller');
const { protect, restrictTo, requireActiveSubscription } = require('../middleware/auth');
const { validate, drawConfigSchema, verificationSchema } = require('../utils/validators');

// Public
router.get('/', getPublishedDraws);

// Authenticated
router.use(protect);
router.get('/my-results', requireActiveSubscription, getMyDrawResults);
router.post('/:drawId/verify', requireActiveSubscription, validate(verificationSchema), submitProof);
router.get('/:id', getDrawById);

// Admin only
router.post('/run', restrictTo('admin'), validate(drawConfigSchema), runDraw);
router.post('/:id/publish', restrictTo('admin'), publishDraw);

module.exports = router;
