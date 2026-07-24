const Service = require('../models/Service');
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

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
  try {
    const services = await Service.find({}).sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get service by ID or slug
// @route   GET /api/services/:idOrSlug
// @access  Public
const getServiceByIdOrSlug = async (req, res) => {
  try {
    const query = req.params.idOrSlug.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: req.params.idOrSlug }
      : { slug: req.params.idOrSlug };

    const service = await Service.findOne(query);

    if (service) {
      res.json(service);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a service
// @route   POST /api/services
// @access  Private
const createService = async (req, res) => {
  try {
    const { title, icon, shortDescription, detailedDescription, benefits } = req.body;

    const slug = slugify(title);
    const existing = await Service.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: 'A service with this title/slug already exists' });
    }

    let imageUrl = req.body.image || '';
    if (req.file) {
      imageUrl = await handleUpload(req.file);
    }

    const service = await Service.create({
      title,
      slug,
      icon,
      shortDescription,
      detailedDescription,
      benefits: benefits ? (Array.isArray(benefits) ? benefits : JSON.parse(benefits)) : [],
      image: imageUrl,
      status: req.body.status !== undefined ? req.body.status : true,
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private
const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (service) {
      service.title = req.body.title || service.title;
      service.slug = req.body.title ? slugify(req.body.title) : service.slug;
      service.icon = req.body.icon || service.icon;
      service.shortDescription = req.body.shortDescription || service.shortDescription;
      service.detailedDescription = req.body.detailedDescription || service.detailedDescription;
      
      if (req.body.benefits) {
        service.benefits = Array.isArray(req.body.benefits)
          ? req.body.benefits
          : JSON.parse(req.body.benefits);
      }

      if (req.body.status !== undefined) {
        service.status = req.body.status === 'true' || req.body.status === true;
      }

      if (req.file) {
        service.image = await handleUpload(req.file);
      } else if (req.body.image !== undefined) {
        service.image = req.body.image;
      }

      const updatedService = await service.save();
      res.json(updatedService);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (service) {
      await service.deleteOne();
      res.json({ message: 'Service removed successfully' });
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getServices,
  getServiceByIdOrSlug,
  createService,
  updateService,
  deleteService,
};
