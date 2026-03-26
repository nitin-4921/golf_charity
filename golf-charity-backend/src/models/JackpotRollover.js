const mongoose = require('mongoose');

/**
 * Tracks the accumulated jackpot rollover amount across months.
 * There is only ever ONE active document (singleton pattern).
 */
const jackpotRolloverSchema = new mongoose.Schema(
  {
    accumulatedAmount: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('JackpotRollover', jackpotRolloverSchema);
