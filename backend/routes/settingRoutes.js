const express = require('express');
const { getSettings, updateSettings } = require('../controllers/settingController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.route('/')
  .get(getSettings)
  .put(protect, upload.single('logo'), updateSettings);

module.exports = router;
