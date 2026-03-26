const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Score sub-document — stores value (1-45) and date.
 * Max 5 per user; oldest is removed when a 6th is added.
 */
const scoreSchema = new mongoose.Schema(
  {
    value: { type: Number, required: true, min: 1, max: 45 },
    date: { type: Date, required: true },
  },
  { _id: true, timestamps: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },

    // ── Subscription ──
    subscriptionStatus: {
      type: String,
      enum: ['active', 'inactive', 'expired', 'cancelled'],
      default: 'inactive',
    },
    subscriptionPlan: { type: String, enum: ['monthly', 'yearly', null], default: null },
    subscriptionStartDate: { type: Date, default: null },
    subscriptionEndDate: { type: Date, default: null },

    // ── Stripe ──
    stripeCustomerId: { type: String, default: null },
    stripeSubscriptionId: { type: String, default: null },

    // ── Charity ──
    charityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Charity', default: null },
    charityContributionPercentage: { type: Number, default: 10, min: 10, max: 100 },

    // ── Scores (rolling last 5) ──
    scores: { type: [scoreSchema], default: [] },
  },
  { timestamps: true }
);

// ── Indexes ──
userSchema.index({ subscriptionStatus: 1 });
userSchema.index({ charityId: 1 });

// ── Hash password before save ──
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ── Compare password ──
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ── Add score with rolling-5 logic ──
userSchema.methods.addScore = function (value, date) {
  this.scores.push({ value, date });
  // Keep only the latest 5 — sort desc then slice
  this.scores.sort((a, b) => new Date(b.date) - new Date(a.date));
  if (this.scores.length > 5) {
    this.scores = this.scores.slice(0, 5);
  }
};

// ── Never return password in JSON ──
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
