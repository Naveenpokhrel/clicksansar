const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: String,
      required: true,
      trim: true,
    },
    period: {
      type: String,
      default: 'monthly',
      trim: true,
    },
    features: {
      type: [String],
      default: [],
    },
    buttonText: {
      type: String,
      default: 'Choose Plan',
      trim: true,
    },
    popular: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Pricing', pricingSchema);
