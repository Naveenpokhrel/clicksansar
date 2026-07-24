const Pricing = require('../models/Pricing');

// @desc    Get all pricing plans
// @route   GET /api/pricing
// @access  Public
const getPricing = async (req, res) => {
  try {
    const plans = await Pricing.find({}).sort({ price: 1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a pricing plan
// @route   POST /api/pricing
// @access  Private
const createPricing = async (req, res) => {
  try {
    const { name, price, period, features, buttonText, popular } = req.body;

    const plan = await Pricing.create({
      name,
      price,
      period: period || 'monthly',
      features: features ? (Array.isArray(features) ? features : JSON.parse(features)) : [],
      buttonText: buttonText || 'Choose Plan',
      popular: popular === 'true' || popular === true,
    });

    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a pricing plan
// @route   PUT /api/pricing/:id
// @access  Private
const updatePricing = async (req, res) => {
  try {
    const plan = await Pricing.findById(req.params.id);

    if (plan) {
      plan.name = req.body.name || plan.name;
      plan.price = req.body.price || plan.price;
      plan.period = req.body.period || plan.period;
      plan.buttonText = req.body.buttonText || plan.buttonText;
      
      if (req.body.features) {
        plan.features = Array.isArray(req.body.features)
          ? req.body.features
          : JSON.parse(req.body.features);
      }

      if (req.body.popular !== undefined) {
        plan.popular = req.body.popular === 'true' || req.body.popular === true;
      }

      const updatedPlan = await plan.save();
      res.json(updatedPlan);
    } else {
      res.status(404).json({ message: 'Pricing plan not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a pricing plan
// @route   DELETE /api/pricing/:id
// @access  Private
const deletePricing = async (req, res) => {
  try {
    const plan = await Pricing.findById(req.params.id);

    if (plan) {
      await plan.deleteOne();
      res.json({ message: 'Pricing plan removed successfully' });
    } else {
      res.status(404).json({ message: 'Pricing plan not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPricing,
  createPricing,
  updatePricing,
  deletePricing,
};
