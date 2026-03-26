const router = require('express').Router();
const { stripeWebhook } = require('../controllers/webhook.controller');

// Raw body required for Stripe signature verification
router.post('/stripe', require('express').raw({ type: 'application/json' }), stripeWebhook);

module.exports = router;
