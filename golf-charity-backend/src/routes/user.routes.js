const router = require('express').Router();
const { getDashboard, updateProfile } = require('../controllers/user.controller');
const { protect, requireActiveSubscription } = require('../middleware/auth');

router.use(protect);

router.get('/dashboard', getDashboard);
router.put('/profile', updateProfile);

module.exports = router;
