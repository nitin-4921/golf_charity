const router = require('express').Router();
const {
  createCheckoutSession,
  cancelSubscription,
  getSubscriptionStatus,
} = require('../controllers/subscription.controller');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/checkout', createCheckoutSession);
router.post('/cancel', cancelSubscription);
router.get('/status', getSubscriptionStatus);

module.exports = router;
