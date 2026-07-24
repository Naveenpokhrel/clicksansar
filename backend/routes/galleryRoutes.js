const express = require('express');
const { getGallery, createGallery, deleteGallery } = require('../controllers/galleryController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.route('/')
  .get(getGallery)
  .post(protect, upload.single('image'), createGallery);

router.route('/:id')
  .delete(protect, deleteGallery);

module.exports = router;
