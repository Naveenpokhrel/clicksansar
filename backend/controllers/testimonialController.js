const Testimonial = require('../models/Testimonial');
const { handleUpload } = require('../middleware/uploadMiddleware');

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a testimonial
// @route   POST /api/testimonials
// @access  Private
const createTestimonial = async (req, res) => {
  try {
    const { name, role, company, rating, review } = req.body;

    let imageUrl = req.body.image || '';
    if (req.file) {
      imageUrl = await handleUpload(req.file);
    }

    const testimonial = await Testimonial.create({
      name,
      role: role || 'Business Owner',
      company: company || '',
      rating: Number(rating) || 5,
      review,
      image: imageUrl,
    });

    res.status(201).json(testimonial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a testimonial
// @route   PUT /api/testimonials/:id
// @access  Private
const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (testimonial) {
      testimonial.name = req.body.name || testimonial.name;
      testimonial.role = req.body.role || testimonial.role;
      testimonial.company = req.body.company || testimonial.company;
      testimonial.rating = req.body.rating !== undefined ? Number(req.body.rating) : testimonial.rating;
      testimonial.review = req.body.review || testimonial.review;

      if (req.file) {
        testimonial.image = await handleUpload(req.file);
      } else if (req.body.image !== undefined) {
        testimonial.image = req.body.image;
      }

      const updatedTestimonial = await testimonial.save();
      res.json(updatedTestimonial);
    } else {
      res.status(404).json({ message: 'Testimonial not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private
const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (testimonial) {
      await testimonial.deleteOne();
      res.json({ message: 'Testimonial removed successfully' });
    } else {
      res.status(404).json({ message: 'Testimonial not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
