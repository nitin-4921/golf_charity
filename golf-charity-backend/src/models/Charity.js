const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String },
});

const charitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    image: { type: String, default: null }, // URL
    website: { type: String, default: null },
    totalDonations: { type: Number, default: 0 }, // cumulative £ donated
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    events: { type: [eventSchema], default: [] },
  },
  { timestamps: true }
);

charitySchema.index({ name: 'text', description: 'text' }); // text search
charitySchema.index({ isFeatured: 1 });
charitySchema.index({ isActive: 1 });

module.exports = mongoose.model('Charity', charitySchema);
