const Gallery = require('../models/Gallery');
const { handleUpload } = require('../middleware/uploadMiddleware');

// @desc    Get all gallery images
// @route   GET /api/gallery
// @access  Public
const getGallery = async (req, res) => {
  try {
    const category = req.query.category;
    const query = category && category !== 'All' ? { category } : {};
    const galleryItems = await Gallery.find(query).sort({ createdAt: -1 });
    res.json(galleryItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a gallery image
// @route   POST /api/gallery
// @access  Private
const createGallery = async (req, res) => {
  try {
    const { title, category } = req.body;

    let imageUrl = req.body.image || '';
    if (req.file) {
      imageUrl = await handleUpload(req.file);
    }

    if (!imageUrl) {
      return res.status(400).json({ message: 'Please upload an image or provide an image URL' });
    }

    const galleryItem = await Gallery.create({
      title: title || '',
      image: imageUrl,
      category: category || 'Office',
    });

    res.status(201).json(galleryItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a gallery image
// @route   DELETE /api/gallery/:id
// @access  Private
const deleteGallery = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);

    if (galleryItem) {
      await galleryItem.deleteOne();
      res.json({ message: 'Gallery item removed successfully' });
    } else {
      res.status(404).json({ message: 'Gallery item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getGallery,
  createGallery,
  deleteGallery,
};
