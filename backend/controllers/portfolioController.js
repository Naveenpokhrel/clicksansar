const Portfolio = require('../models/Portfolio');
const { handleUpload } = require('../middleware/uploadMiddleware');

// @desc    Get all portfolios
// @route   GET /api/portfolio
// @access  Public
const getPortfolios = async (req, res) => {
  try {
    const category = req.query.category;
    const query = category && category !== 'All' ? { category } : {};
    const portfolios = await Portfolio.find(query).sort({ createdAt: -1 });
    res.json(portfolios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a portfolio item
// @route   POST /api/portfolio
// @access  Private
const createPortfolio = async (req, res) => {
  try {
    const { title, description, category, clientName, projectDate, projectLink } = req.body;

    let imageUrl = req.body.image || '';
    if (req.file) {
      imageUrl = await handleUpload(req.file);
    }

    const portfolio = await Portfolio.create({
      title,
      description,
      category,
      image: imageUrl,
      clientName,
      projectDate: projectDate || Date.now(),
      projectLink,
    });

    res.status(201).json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update portfolio item
// @route   PUT /api/portfolio/:id
// @access  Private
const updatePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);

    if (portfolio) {
      portfolio.title = req.body.title || portfolio.title;
      portfolio.description = req.body.description || portfolio.description;
      portfolio.category = req.body.category || portfolio.category;
      portfolio.clientName = req.body.clientName || portfolio.clientName;
      portfolio.projectDate = req.body.projectDate || portfolio.projectDate;
      portfolio.projectLink = req.body.projectLink || portfolio.projectLink;

      if (req.file) {
        portfolio.image = await handleUpload(req.file);
      } else if (req.body.image !== undefined) {
        portfolio.image = req.body.image;
      }

      const updatedPortfolio = await portfolio.save();
      res.json(updatedPortfolio);
    } else {
      res.status(404).json({ message: 'Portfolio item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete portfolio item
// @route   DELETE /api/portfolio/:id
// @access  Private
const deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);

    if (portfolio) {
      await portfolio.deleteOne();
      res.json({ message: 'Portfolio item removed successfully' });
    } else {
      res.status(404).json({ message: 'Portfolio item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPortfolios,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
};
