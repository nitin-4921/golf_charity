const stripe = require('../config/stripe');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');

const PLANS = {
  monthly: process.env.STRIPE_MONTHLY_PRICE_ID,
  yearly: process.env.STRIPE_YEARLY_PRICE_ID,
};

/**
 * POST /api/subscriptions/checkout
 * Creates a Stripe Checkout session and returns the URL.
 */
exports.createCheckoutSession = async (req, res, next) => {
  try {
    const { plan } = req.body;
    if (!PLANS[plan]) return next(new AppError('Invalid plan. Choose monthly or yearly.', 400));

    const user = req.user;

    // Create or retrieve Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user._id.toString() },
      });
      customerId = customer.id;
      await User.findByIdAndUpdate(user._id, { stripeCustomerId: customerId });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: PLANS[plan], quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL}/dashboard?subscription=success`,
      cancel_url: `${process.env.CLIENT_URL}/pricing?subscription=cancelled`,
      metadata: { userId: user._id.toString(), plan },
    });

    sendSuccess(res, 200, 'Checkout session created.', { url: session.url });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/subscriptions/cancel
 * Cancels the user's Stripe subscription at period end.
 */
exports.cancelSubscription = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user.stripeSubscriptionId) {
      return next(new AppError('No active subscription found.', 400));
    }

    await stripe.subscriptions.update(user.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    await User.findByIdAndUpdate(user._id, { subscriptionStatus: 'cancelled' });

    sendSuccess(res, 200, 'Subscription will be cancelled at the end of the billing period.');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/subscriptions/status
 */
exports.getSubscriptionStatus = async (req, res) => {
  const { subscriptionStatus, subscriptionPlan, subscriptionStartDate, subscriptionEndDate } = req.user;
  sendSuccess(res, 200, 'Subscription status retrieved.', {
    subscriptionStatus,
    subscriptionPlan,
    subscriptionStartDate,
    subscriptionEndDate,
  });
};
