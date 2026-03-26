const mongoose = require('mongoose');

/**
 * A single winner entry within a draw result tier.
 */
const winnerEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  matchCount: { type: Number, required: true }, // 3, 4, or 5
  prizeAmount: { type: Number, required: true }, // calculated share
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'paid'],
    default: 'pending',
  },
  proofUrl: { type: String, default: null },
  adminNote: { type: String, default: null },
});

const drawSchema = new mongoose.Schema(
  {
    drawDate: { type: Date, required: true },
    generatedNumbers: {
      type: [Number],
      required: true,
      validate: [(arr) => arr.length === 5, 'Draw must have exactly 5 numbers'],
    },
    drawType: { type: String, enum: ['random', 'algorithm'], default: 'random' },
    resultsPublished: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null },

    // ── Prize pool snapshot at draw time ──
    totalPool: { type: Number, default: 0 },
    jackpotPool: { type: Number, default: 0 }, // 40% tier (may include rollover)
    fourMatchPool: { type: Number, default: 0 }, // 35% tier
    threeMatchPool: { type: Number, default: 0 }, // 25% tier

    // ── Rollover ──
    jackpotRolledOver: { type: Boolean, default: false },
    rolledOverAmount: { type: Number, default: 0 },

    // ── Participant snapshot ──
    totalParticipants: { type: Number, default: 0 },

    // ── Winners ──
    winners: { type: [winnerEntrySchema], default: [] },

    // ── Simulation flag ──
    isSimulation: { type: Boolean, default: false },
  },
  { timestamps: true }
);

drawSchema.index({ drawDate: -1 });
drawSchema.index({ resultsPublished: 1 });

module.exports = mongoose.model('Draw', drawSchema);
