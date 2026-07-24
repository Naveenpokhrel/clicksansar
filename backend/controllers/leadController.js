const Lead = require('../models/Lead');
const { validateLead } = require('../utils/validators');
const { sendLeadNotification } = require('../services/emailService');

// @desc    Submit a new lead
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
    const lead = await Lead.create(req.body);
    // Send email alert in background
    sendLeadNotification(lead);

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully! We will get back to you shortly.',
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
    const pageSize = 10;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.keyword
      ? {
          $or: [
            { fullName: { $regex: req.query.keyword, $options: 'i' } },
            { email: { $regex: req.query.keyword, $options: 'i' } },
            { phone: { $regex: req.query.keyword, $options: 'i' } },
            { serviceInterested: { $regex: req.query.keyword, $options: 'i' } },
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

// @desc    Update lead status
// @route   PUT /api/leads/:id/status
// @access  Private
const updateLeadStatus = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (lead) {
      lead.status = req.body.status || lead.status;
      const updatedLead = await lead.save();
      res.json(updatedLead);
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
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

module.exports = {
  submitLead,
  getLeads,
  updateLeadStatus,
  deleteLead,
};
