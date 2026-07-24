const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      default: 'Click Sansar',
      trim: true,
    },
    logo: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: 'info@clicksansar.com',
      trim: true,
    },
    phone: {
      type: String,
      default: '+977-9800000000',
      trim: true,
    },
    address: {
      type: String,
      default: 'Kathmandu, Nepal',
      trim: true,
    },
    mapUrl: {
      type: String,
      default: '',
      trim: true,
    },
    socialLinks: {
      facebook: { type: String, default: 'https://facebook.com/clicksansar' },
      instagram: { type: String, default: 'https://instagram.com/clicksansar' },
      linkedin: { type: String, default: 'https://linkedin.com/company/clicksansar' },
      youtube: { type: String, default: 'https://youtube.com/clicksansar' },
      tiktok: { type: String, default: 'https://tiktok.com/@clicksansar' },
    },
    chatbotWelcome: {
      type: String,
      default: 'Hello! Welcome to Click Sansar. How can we help grow your business online today?',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Setting', settingSchema);
