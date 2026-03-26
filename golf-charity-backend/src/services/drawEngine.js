const User = require('../models/User');

const DRAW_SIZE = 5;
const SCORE_MIN = 1;
const SCORE_MAX = 45;

/**
 * Generates 5 unique random numbers between 1–45.
 * Standard lottery-style draw.
 */
const generateRandomDraw = () => {
  const numbers = new Set();
  while (numbers.size < DRAW_SIZE) {
    numbers.add(Math.floor(Math.random() * SCORE_MAX) + SCORE_MIN);
  }
  return Array.from(numbers).sort((a, b) => a - b);
};

/**
 * Generates 5 numbers weighted by frequency of scores across all active subscribers.
 *
 * Strategy:
 *  - Tally all score values from active users
 *  - Build a weighted pool (higher frequency = higher chance of selection)
 *  - Pick 5 unique numbers from the pool
 *
 * This creates draws that are statistically harder to win when common scores dominate.
 */
const generateAlgorithmicDraw = async () => {
  const users = await User.find({ subscriptionStatus: 'active', 'scores.0': { $exists: true } });

  // Build frequency map
  const freq = {};
  for (let n = SCORE_MIN; n <= SCORE_MAX; n++) freq[n] = 0;

  users.forEach((user) => {
    user.scores.forEach((s) => {
      if (s.value >= SCORE_MIN && s.value <= SCORE_MAX) {
        freq[s.value]++;
      }
    });
  });

  // Build weighted pool — each number appears proportional to its frequency (min 1)
  const pool = [];
  for (let n = SCORE_MIN; n <= SCORE_MAX; n++) {
    const weight = Math.max(1, freq[n]);
    for (let i = 0; i < weight; i++) pool.push(n);
  }

  // Pick 5 unique numbers from weighted pool
  const selected = new Set();
  let attempts = 0;
  while (selected.size < DRAW_SIZE && attempts < 10000) {
    const idx = Math.floor(Math.random() * pool.length);
    selected.add(pool[idx]);
    attempts++;
  }

  // Fallback to random if pool exhausted (shouldn't happen)
  if (selected.size < DRAW_SIZE) return generateRandomDraw();

  return Array.from(selected).sort((a, b) => a - b);
};

/**
 * Counts how many of a user's scores match the drawn numbers.
 * @param {number[]} userScores - array of score values
 * @param {number[]} drawnNumbers - 5 drawn numbers
 * @returns {number} match count (0–5)
 */
const countMatches = (userScores, drawnNumbers) => {
  const drawnSet = new Set(drawnNumbers);
  const userSet = new Set(userScores);
  let count = 0;
  userSet.forEach((s) => { if (drawnSet.has(s)) count++; });
  return count;
};

/**
 * Finds all winners among active subscribers for a given draw.
 * Returns arrays of userIds grouped by match tier.
 *
 * @param {number[]} drawnNumbers
 * @returns {{ fiveMatch: ObjectId[], fourMatch: ObjectId[], threeMatch: ObjectId[] }}
 */
const findWinners = async (drawnNumbers) => {
  const users = await User.find({ subscriptionStatus: 'active', 'scores.0': { $exists: true } });

  const results = { fiveMatch: [], fourMatch: [], threeMatch: [] };

  users.forEach((user) => {
    const userScoreValues = user.scores.map((s) => s.value);
    const matches = countMatches(userScoreValues, drawnNumbers);

    if (matches === 5) results.fiveMatch.push(user._id);
    else if (matches === 4) results.fourMatch.push(user._id);
    else if (matches === 3) results.threeMatch.push(user._id);
  });

  return results;
};

module.exports = { generateRandomDraw, generateAlgorithmicDraw, findWinners, countMatches };
