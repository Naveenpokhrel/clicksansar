const express = require('express');
const { getBlogs, getBlogByIdOrSlug, createBlog, updateBlog, deleteBlog } = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.route('/')
  .get(getBlogs)
  .post(protect, upload.single('image'), createBlog);

router.route('/:idOrSlug')
  .get(getBlogByIdOrSlug);

router.route('/:id')
  .put(protect, upload.single('image'), updateBlog)
  .delete(protect, deleteBlog);

module.exports = router;
