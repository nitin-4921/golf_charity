const router = require('express').Router();
const {
  getCharities,
  getCharityById,
  createCharity,
  updateCharity,
  deleteCharity,
  selectCharity,
} = require('../controllers/charity.controller');
const { protect, restrictTo } = require('../middleware/auth');
const { validate, charitySchema } = require('../utils/validators');

// Public
router.get('/', getCharities);

// Authenticated user — must be before /:id to avoid route conflict
router.put('/select', protect, selectCharity);

router.get('/:id', getCharityById);

// Admin only
router.post('/', protect, restrictTo('admin'), validate(charitySchema), createCharity);
router.put('/:id', protect, restrictTo('admin'), updateCharity);
router.delete('/:id', protect, restrictTo('admin'), deleteCharity);

module.exports = router;
