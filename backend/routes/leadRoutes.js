const express = require('express');
const {
  submitLead,
  getLeads,
  updateLeadStatus,
  confirmPaymentAndReleaseKey,
  getLeadByOrderNumber,
  clientDeleteOrderByNumber,
  clientDeleteOwnOrder,
  deleteLead,
} = require('../controllers/leadController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(submitLead)
  .get(protect, getLeads);

router.route('/lookup/:orderNumber')
  .get(getLeadByOrderNumber);

// Client order cancellation / deletion routes
router.route('/order/:orderNumber')
  .delete(clientDeleteOrderByNumber);

router.route('/my-order/:id')
  .delete(protect, clientDeleteOwnOrder);

router.route('/:id')
  .delete(protect, deleteLead);

router.route('/:id/status')
  .put(protect, updateLeadStatus);

router.route('/:id/confirm-payment')
  .put(protect, confirmPaymentAndReleaseKey);

module.exports = router;
