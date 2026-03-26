const User = require('../models/User');
const JackpotRollover = require('../models/JackpotRollover');

// Prize pool distribution percentages (from PRD §07)
const POOL_DISTRIBUTION = {
  fiveMatch: 0.40,
  fourMatch: 0.35,
  threeMatch: 0.25,
};

// Portion of each subscription that goes to the prize pool
// Adjust this based on your pricing model
const PRIZE_POOL_PERCENTAGE = 0.50; // 50% of subscription revenue

/**
 * Calculates the total prize pool for the current draw period.
 * Based on active subscriber count × subscription fee × pool percentage.
 *
 * @param {number} monthlyFee - monthly subscription fee in pence/cents
 * @param {number} yearlyFee - yearly subscription fee in pence/cents
 * @returns {Promise<number>} total pool amount
 */
const calculateTotalPool = async (monthlyFee, yearlyFee) => {
  const [monthlyCount, yearlyCount] = await Promise.all([
    User.countDocuments({ subscriptionStatus: 'active', subscriptionPlan: 'monthly' }),
    User.countDocuments({ subscriptionStatus: 'active', subscriptionPlan: 'yearly' }),
  ]);

  // Yearly fee is amortised to monthly for pool calculation
  const monthlyYearlyEquivalent = yearlyFee / 12;

  const totalRevenue =
    monthlyCount * monthlyFee + yearlyCount * monthlyYearlyEquivalent;

  return Math.floor(totalRevenue * PRIZE_POOL_PERCENTAGE);
};

/**
 * Calculates prize tiers and handles jackpot rollover.
 *
 * @param {number} totalPool
 * @param {{ fiveMatch: ObjectId[], fourMatch: ObjectId[], threeMatch: ObjectId[] }} winners
 * @returns {Promise<{
 *   jackpotPool: number,
 *   fourMatchPool: number,
 *   threeMatchPool: number,
 *   jackpotRolledOver: boolean,
 *   rolledOverAmount: number,
 *   winnerEntries: Array
 * }>}
 */
const calculatePrizes = async (totalPool, winners) => {
  // Fetch current rollover
  let rolloverDoc = await JackpotRollover.findOne();
  if (!rolloverDoc) rolloverDoc = await JackpotRollover.create({ accumulatedAmount: 0 });

  const baseJackpot = Math.floor(totalPool * POOL_DISTRIBUTION.fiveMatch);
  const jackpotPool = baseJackpot + rolloverDoc.accumulatedAmount;
  const fourMatchPool = Math.floor(totalPool * POOL_DISTRIBUTION.fourMatch);
  const threeMatchPool = Math.floor(totalPool * POOL_DISTRIBUTION.threeMatch);

  let jackpotRolledOver = false;
  let rolledOverAmount = 0;
  const winnerEntries = [];

  // ── 5-Match (Jackpot) ──
  if (winners.fiveMatch.length > 0) {
    const share = Math.floor(jackpotPool / winners.fiveMatch.length);
    winners.fiveMatch.forEach((userId) => {
      winnerEntries.push({ userId, matchCount: 5, prizeAmount: share });
    });
    // Reset rollover
    await JackpotRollover.findOneAndUpdate({}, { accumulatedAmount: 0, lastUpdated: new Date() });
  } else {
    // No 5-match winner — rollover jackpot
    jackpotRolledOver = true;
    rolledOverAmount = jackpotPool;
    await JackpotRollover.findOneAndUpdate(
      {},
      { accumulatedAmount: jackpotPool, lastUpdated: new Date() },
      { upsert: true }
    );
  }

  // ── 4-Match ──
  if (winners.fourMatch.length > 0) {
    const share = Math.floor(fourMatchPool / winners.fourMatch.length);
    winners.fourMatch.forEach((userId) => {
      winnerEntries.push({ userId, matchCount: 4, prizeAmount: share });
    });
  }

  // ── 3-Match ──
  if (winners.threeMatch.length > 0) {
    const share = Math.floor(threeMatchPool / winners.threeMatch.length);
    winners.threeMatch.forEach((userId) => {
      winnerEntries.push({ userId, matchCount: 3, prizeAmount: share });
    });
  }

  return {
    jackpotPool,
    fourMatchPool,
    threeMatchPool,
    jackpotRolledOver,
    rolledOverAmount,
    winnerEntries,
  };
};

module.exports = { calculateTotalPool, calculatePrizes, POOL_DISTRIBUTION };
