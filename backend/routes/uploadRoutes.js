const express = require('express');
const { upload, handleUpload } = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @desc    Upload file/image
// @route   POST /api/upload
// @access  Private
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageUrl = await handleUpload(req.file);
    res.json({ imageUrl, url: imageUrl });
  } catch (error) {
    console.error('File Upload Error:', error);
    res.status(500).json({ message: error.message || 'File upload failed' });
  }
});

module.exports = router;
