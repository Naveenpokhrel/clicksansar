const express = require('express');
const { getServices, getServiceByIdOrSlug, createService, updateService, deleteService } = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.route('/')
  .get(getServices)
  .post(protect, upload.single('image'), createService);

router.route('/:idOrSlug')
  .get(getServiceByIdOrSlug);

router.route('/:id')
  .put(protect, upload.single('image'), updateService)
  .delete(protect, deleteService);

module.exports = router;
