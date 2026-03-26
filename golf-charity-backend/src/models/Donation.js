const mongoose = require('mongoose');

/**
 * Records each charity contribution made from a subscription payment.
 */
const donationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    charityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Charity', required: true },
    amount: { type: Number, required: true }, // in pence/cents
    contributionPercentage: { type: Number, required: true },
    subscriptionPeriod: { type: String }, // e.g. "2024-06"
    stripePaymentIntentId: { type: String, default: null },
  },
  { timestamps: true }
);

donationSchema.index({ userId: 1 });
donationSchema.index({ charityId: 1 });

module.exports = mongoose.model('Donation', donationSchema);
