const Blog = require('../models/Blog');
const { handleUpload } = require('../middleware/uploadMiddleware');

// Helper to make slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res) => {
  try {
    const { category, search } = req.query;
    
    let query = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const blogs = await Blog.find(query).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get blog by ID or slug
// @route   GET /api/blogs/:idOrSlug
// @access  Public
const getBlogByIdOrSlug = async (req, res) => {
  try {
    const query = req.params.idOrSlug.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: req.params.idOrSlug }
      : { slug: req.params.idOrSlug };

    const blog = await Blog.findOne(query);

    if (blog) {
      blog.views += 1;
      await blog.save();
      res.json(blog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a blog
// @route   POST /api/blogs
// @access  Private
const createBlog = async (req, res) => {
  try {
    const { title, excerpt, content, category, author } = req.body;

    const slug = slugify(title);
    const existing = await Blog.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: 'A blog post with this title/slug already exists' });
    }

    let imageUrl = req.body.image || '';
    if (req.file) {
      imageUrl = await handleUpload(req.file);
    }

    const blog = await Blog.create({
      title,
      slug,
      excerpt,
      content,
      category,
      author: author || 'Click Sansar',
      image: imageUrl,
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Private
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      blog.title = req.body.title || blog.title;
      blog.slug = req.body.title ? slugify(req.body.title) : blog.slug;
      blog.excerpt = req.body.excerpt || blog.excerpt;
      blog.content = req.body.content || blog.content;
      blog.category = req.body.category || blog.category;
      blog.author = req.body.author || blog.author;

      if (req.file) {
        blog.image = await handleUpload(req.file);
      } else if (req.body.image !== undefined) {
        blog.image = req.body.image;
      }

      const updatedBlog = await blog.save();
      res.json(updatedBlog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      await blog.deleteOne();
      res.json({ message: 'Blog removed successfully' });
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBlogs,
  getBlogByIdOrSlug,
  createBlog,
  updateBlog,
  deleteBlog,
};
