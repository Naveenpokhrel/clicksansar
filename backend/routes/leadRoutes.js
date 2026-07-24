const express = require('express');
const { submitLead, getLeads, updateLeadStatus, deleteLead } = require('../controllers/leadController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(submitLead)
  .get(protect, getLeads);

router.route('/:id')
  .delete(protect, deleteLead);

router.route('/:id/status')
  .put(protect, updateLeadStatus);

module.exports = router;
