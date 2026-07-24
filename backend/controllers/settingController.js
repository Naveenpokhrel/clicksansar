const Setting = require('../models/Setting');
const { handleUpload } = require('../middleware/uploadMiddleware');

// @desc    Get website settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      // Create default settings if none exist
      settings = await Setting.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update website settings
// @route   PUT /api/settings
// @access  Private
const updateSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting({});
    }

    settings.companyName = req.body.companyName || settings.companyName;
    settings.email = req.body.email || settings.email;
    settings.phone = req.body.phone || settings.phone;
    settings.address = req.body.address || settings.address;
    settings.mapUrl = req.body.mapUrl || settings.mapUrl;
    settings.chatbotWelcome = req.body.chatbotWelcome || settings.chatbotWelcome;

    if (req.body.socialLinks) {
      settings.socialLinks = typeof req.body.socialLinks === 'string'
        ? JSON.parse(req.body.socialLinks)
        : req.body.socialLinks;
    }

    if (req.file) {
      settings.logo = await handleUpload(req.file);
    } else if (req.body.logo !== undefined) {
      settings.logo = req.body.logo;
    }

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
