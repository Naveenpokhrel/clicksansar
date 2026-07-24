const FAQ = require('../models/FAQ');

// @desc    Get all FAQs
// @route   GET /api/faqs
// @access  Public
const getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find({}).sort({ category: 1 });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an FAQ
// @route   POST /api/faqs
// @access  Private
const createFAQ = async (req, res) => {
  try {
    const { question, answer, category } = req.body;

    const faq = await FAQ.create({
      question,
      answer,
      category: category || 'General',
    });

    res.status(201).json(faq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an FAQ
// @route   PUT /api/faqs/:id
// @access  Private
const updateFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);

    if (faq) {
      faq.question = req.body.question || faq.question;
      faq.answer = req.body.answer || faq.answer;
      faq.category = req.body.category || faq.category;

      const updatedFAQ = await faq.save();
      res.json(updatedFAQ);
    } else {
      res.status(404).json({ message: 'FAQ not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an FAQ
// @route   DELETE /api/faqs/:id
// @access  Private
const deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);

    if (faq) {
      await faq.deleteOne();
      res.json({ message: 'FAQ removed successfully' });
    } else {
      res.status(404).json({ message: 'FAQ not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
};
