const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    businessType: {
      type: String,
      trim: true,
    },
    serviceInterested: {
      type: String,
      required: true,
      trim: true,
    },
    budget: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    paymentMethod: {
      type: String,
      trim: true,
      default: 'eSewa',
    },
    transactionId: {
      type: String,
      trim: true,
    },
    paymentProof: {
      type: String,
      trim: true,
    },
    amountPaid: {
      type: String,
      trim: true,
    },
    orderNumber: {
      type: String,
      trim: true,
    },
    productKey: {
      type: String,
      trim: true,
    },
    isPaymentConfirmed: {
      type: Boolean,
      default: false,
    },
    deliveryStatus: {
      type: String,
      enum: ['Pending', 'In Progress', 'Active', 'Completed'],
      default: 'Pending',
    },
    adminNote: {
      type: String,
      trim: true,
      default: '',
    },
    confirmedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['New', 'Payment Received', 'Contacted', 'In Progress', 'Converted', 'Archived'],
      default: 'New',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Lead', leadSchema);
