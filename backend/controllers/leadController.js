const Lead = require('../models/Lead');
const { validateLead } = require('../utils/validators');
const { sendLeadNotification } = require('../services/emailService');

// @desc    Submit a new lead or checkout order
// @route   POST /api/leads
// @access  Public
const submitLead = async (req, res) => {
  const validation = validateLead(req.body);

  if (!validation.success) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: validation.error.format(),
    });
  }

  try {
    const generatedOrderNum = req.body.orderNumber || Math.floor(10000 + Math.random() * 90000).toString();
    const leadData = {
      ...req.body,
      orderNumber: generatedOrderNum,
      // Locked until confirmed by Admin in panel
      isPaymentConfirmed: false,
      deliveryStatus: req.body.deliveryStatus || 'Pending',
      status: 'New',
    };

    const lead = await Lead.create(leadData);

    // Send email alert in background
    try {
      sendLeadNotification(lead);
    } catch (e) {
      console.log('Lead notification error:', e.message);
    }

    res.status(201).json({
      success: true,
      message: 'Order and inquiry submitted successfully! Awaiting payment verification by admin.',
      lead,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all leads with pagination & search
// @route   GET /api/leads
// @access  Private
const getLeads = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 20;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.keyword
      ? {
          $or: [
            { fullName: { $regex: req.query.keyword, $options: 'i' } },
            { email: { $regex: req.query.keyword, $options: 'i' } },
            { phone: { $regex: req.query.keyword, $options: 'i' } },
            { serviceInterested: { $regex: req.query.keyword, $options: 'i' } },
            { transactionId: { $regex: req.query.keyword, $options: 'i' } },
            { orderNumber: { $regex: req.query.keyword, $options: 'i' } },
            { productKey: { $regex: req.query.keyword, $options: 'i' } },
          ],
        }
      : {};

    const count = await Lead.countDocuments({ ...keyword });
    const leads = await Lead.find({ ...keyword })
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ leads, page, pages: Math.ceil(count / pageSize), total: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update lead status (standard)
// @route   PUT /api/leads/:id/status
// @access  Private
const updateLeadStatus = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (lead) {
      lead.status = req.body.status || lead.status;
      
      if (req.body.status === 'Payment Received') {
        lead.isPaymentConfirmed = true;
        lead.confirmedAt = new Date();
        if (lead.deliveryStatus === 'Pending') {
          lead.deliveryStatus = 'In Progress';
        }
      }

      if (req.body.deliveryStatus) {
        lead.deliveryStatus = req.body.deliveryStatus;
      }

      if (req.body.productKey) {
        lead.productKey = req.body.productKey;
      }

      if (req.body.adminNote !== undefined) {
        lead.adminNote = req.body.adminNote;
      }

      const updatedLead = await lead.save();
      res.json(updatedLead);
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin explicitly confirms eSewa payment & releases Product Key
// @route   PUT /api/leads/:id/confirm-payment
// @access  Private
const confirmPaymentAndReleaseKey = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Order / Lead not found' });
    }

    lead.status = 'Payment Received';
    lead.isPaymentConfirmed = true;
    lead.confirmedAt = new Date();
    lead.deliveryStatus = req.body.deliveryStatus || 'In Progress';
    
    if (req.body.productKey && req.body.productKey.trim()) {
      lead.productKey = req.body.productKey.trim();
    }
    
    if (req.body.adminNote !== undefined) {
      lead.adminNote = req.body.adminNote;
    }

    const updatedLead = await lead.save();

    res.json({
      success: true,
      message: 'Payment confirmed & Product Key released to client!',
      lead: updatedLead,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (lead) {
      await lead.deleteOne();
      res.json({ message: 'Lead removed successfully' });
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLeadByOrderNumber = async (req, res) => {
  try {
    const lead = await Lead.findOne({ orderNumber: req.params.orderNumber });
    if (!lead) {
      return res.status(404).json({ message: 'Order not found' });
    }
    const leadObj = lead.toObject();
    if (!leadObj.isPaymentConfirmed) {
      leadObj.productKey = 'LOCKED_AWAITING_CONFIRMATION';
    }
    res.json(leadObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Client delete / cancel order by Order Number
// @route   DELETE /api/leads/order/:orderNumber
// @access  Public
const clientDeleteOrderByNumber = async (req, res) => {
  try {
    const lead = await Lead.findOne({ orderNumber: req.params.orderNumber });
    if (!lead) {
      return res.status(404).json({ message: 'Order not found' });
    }
    await lead.deleteOne();
    res.json({ success: true, message: 'Order removed successfully from database' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Client delete their own order by MongoDB ID
// @route   DELETE /api/leads/my-order/:id
// @access  Private
const clientDeleteOwnOrder = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Order not found' });
    }
    // Verify client ownership if not admin
    if (req.user.role !== 'admin') {
      const emailMatches = lead.email && req.user.email && lead.email.toLowerCase() === req.user.email.toLowerCase();
      const phoneMatches = lead.phone && req.user.phone && lead.phone === req.user.phone;
      if (!emailMatches && !phoneMatches) {
        return res.status(403).json({ message: 'Not authorized to delete this order' });
      }
    }
    await lead.deleteOne();
    res.json({ success: true, message: 'Order removed successfully from database' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitLead,
  getLeads,
  updateLeadStatus,
  confirmPaymentAndReleaseKey,
  getLeadByOrderNumber,
  clientDeleteOrderByNumber,
  clientDeleteOwnOrder,
  deleteLead,
};
