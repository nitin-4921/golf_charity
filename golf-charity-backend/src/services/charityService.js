const Charity = require('../models/Charity');
const Donation = require('../models/Donation');

/**
 * Records a charity donation and updates the charity's total.
 *
 * @param {ObjectId} userId
 * @param {ObjectId} charityId
 * @param {number} subscriptionAmount - total subscription amount in pence
 * @param {number} contributionPercentage - user's chosen %
 * @param {string} stripePaymentIntentId
 * @param {string} subscriptionPeriod - e.g. "2024-06"
 */
const recordDonation = async ({
  userId,
  charityId,
  subscriptionAmount,
  contributionPercentage,
  stripePaymentIntentId,
  subscriptionPeriod,
}) => {
  const donationAmount = Math.floor(subscriptionAmount * (contributionPercentage / 100));

  await Donation.create({
    userId,
    charityId,
    amount: donationAmount,
    contributionPercentage,
    subscriptionPeriod,
    stripePaymentIntentId,
  });

  // Increment charity total
  await Charity.findByIdAndUpdate(charityId, {
    $inc: { totalDonations: donationAmount },
  });

  return donationAmount;
};

module.exports = { recordDonation };
