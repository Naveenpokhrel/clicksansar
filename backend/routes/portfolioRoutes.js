const express = require('express');
const { getPortfolios, createPortfolio, updatePortfolio, deletePortfolio } = require('../controllers/portfolioController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.route('/')
  .get(getPortfolios)
  .post(protect, upload.single('image'), createPortfolio);

router.route('/:id')
  .put(protect, upload.single('image'), updatePortfolio)
  .delete(protect, deletePortfolio);

module.exports = router;
