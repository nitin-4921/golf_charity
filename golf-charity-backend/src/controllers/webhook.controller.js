const stripe = require('../config/stripe');
const User = require('../models/User');
const { recordDonation } = require('../services/charityService');
const { sendSubscriptionConfirmation } = require('../services/emailService');
const logger = require('../utils/logger');

/**
 * POST /api/webhooks/stripe
 *
 * Handles Stripe webhook events.
 * Raw body is required — mounted before express.json() in app.js.
 */
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    logger.error(`Stripe webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        await handleCheckoutComplete(session);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        await handlePaymentSucceeded(invoice);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      default:
        logger.info(`Unhandled Stripe event: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    logger.error(`Webhook handler error: ${err.message}`, { stack: err.stack });
    res.status(500).json({ error: 'Webhook processing failed.' });
  }
};

// ── Handlers ──

async function handleCheckoutComplete(session) {
  const { userId, plan } = session.metadata;
  if (!userId) return;

  const subscription = await stripe.subscriptions.retrieve(session.subscription);
  const periodEnd = new Date(subscription.current_period_end * 1000);
  const periodStart = new Date(subscription.current_period_start * 1000);

  const user = await User.findByIdAndUpdate(
    userId,
    {
      subscriptionStatus: 'active',
      subscriptionPlan: plan,
      subscriptionStartDate: periodStart,
      subscriptionEndDate: periodEnd,
      stripeSubscriptionId: subscription.id,
    },
    { new: true }
  );

  if (user) sendSubscriptionConfirmation(user, plan);
  logger.info(`Subscription activated for user ${userId}`);
}

async function handlePaymentSucceeded(invoice) {
  if (!invoice.subscription) return;

  const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
  const customerId = invoice.customer;

  const user = await User.findOne({ stripeCustomerId: customerId });
  if (!user) return;

  const periodEnd = new Date(subscription.current_period_end * 1000);
  const periodStart = new Date(subscription.current_period_start * 1000);

  await User.findByIdAndUpdate(user._id, {
    subscriptionStatus: 'active',
    subscriptionStartDate: periodStart,
    subscriptionEndDate: periodEnd,
  });

  // Record charity donation if user has selected a charity
  if (user.charityId) {
    const amountPaid = invoice.amount_paid; // in pence/cents
    const period = new Date(periodStart).toISOString().slice(0, 7); // "YYYY-MM"

    await recordDonation({
      userId: user._id,
      charityId: user.charityId,
      subscriptionAmount: amountPaid,
      contributionPercentage: user.charityContributionPercentage,
      stripePaymentIntentId: invoice.payment_intent,
      subscriptionPeriod: period,
    });
  }

  logger.info(`Payment succeeded for user ${user._id}`);
}

async function handleSubscriptionUpdated(subscription) {
  const user = await User.findOne({ stripeSubscriptionId: subscription.id });
  if (!user) return;

  const status = subscription.status === 'active' ? 'active' : 'inactive';
  await User.findByIdAndUpdate(user._id, {
    subscriptionStatus: status,
    subscriptionEndDate: new Date(subscription.current_period_end * 1000),
  });
}

async function handleSubscriptionDeleted(subscription) {
  const user = await User.findOne({ stripeSubscriptionId: subscription.id });
  if (!user) return;

  await User.findByIdAndUpdate(user._id, {
    subscriptionStatus: 'expired',
    stripeSubscriptionId: null,
  });

  logger.info(`Subscription expired for user ${user._id}`);
}
