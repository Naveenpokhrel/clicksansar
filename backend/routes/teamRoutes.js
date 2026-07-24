const express = require('express');
const { getTeam, createTeam, updateTeam, deleteTeam } = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.route('/')
  .get(getTeam)
  .post(protect, upload.single('image'), createTeam);

router.route('/:id')
  .put(protect, upload.single('image'), updateTeam)
  .delete(protect, deleteTeam);

module.exports = router;
