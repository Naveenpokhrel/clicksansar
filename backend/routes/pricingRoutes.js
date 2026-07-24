const express = require('express');
const { getPricing, createPricing, updatePricing, deletePricing } = require('../controllers/pricingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getPricing)
  .post(protect, createPricing);

router.route('/:id')
  .put(protect, updatePricing)
  .delete(protect, deletePricing);

module.exports = router;
