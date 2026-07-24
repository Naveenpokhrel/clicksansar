const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Branding', 'Advertising', 'Social Media', 'Video', 'Website', 'Photography'],
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    clientName: {
      type: String,
      trim: true,
    },
    projectDate: {
      type: Date,
      default: Date.now,
    },
    projectLink: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Portfolio', portfolioSchema);
