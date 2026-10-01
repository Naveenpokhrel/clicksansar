const User = require('../models/User');
const Lead = require('../models/Lead');
const generateToken = require('../utils/generateToken');

// @desc    Register a new client user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { fullName, email, phone, password, username } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    // Auto-generate username from email or phone if not provided
    const cleanUsername = (username || cleanEmail.split('@')[0] || `user_${Date.now()}`)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_]/g, '');

    const userExists = await User.findOne({
      $or: [{ email: cleanEmail }, { username: cleanUsername }],
    });

    if (userExists) {
      return res.status(400).json({
        message: userExists.email === cleanEmail ? 'Email already registered' : 'Username is taken',
      });
    }

    const user = await User.create({
      fullName: fullName ? fullName.trim() : cleanUsername,
      email: cleanEmail,
      phone: phone ? phone.trim() : '',
      username: cleanUsername,
      password,
      role: 'client',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token (supports login with username OR email)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { username, email, password } = req.body;
  const loginIdentifier = (email || username || '').toLowerCase().trim();

  try {
    if (!loginIdentifier || !password) {
      return res.status(400).json({ message: 'Please provide email/username and password' });
    }

    const user = await User.findOne({
      $or: [{ email: loginIdentifier }, { username: loginIdentifier }],
    });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        fullName: user.fullName || user.username,
        username: user.username,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials. Please check your email and password.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        fullName: user.fullName || user.username,
        username: user.username,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.fullName = req.body.fullName || user.fullName;
      user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
      user.email = req.body.email ? req.body.email.toLowerCase().trim() : user.email;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        username: updatedUser.username,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get orders / service inquiries for current client
// @route   GET /api/auth/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const query = {
      $or: [{ email: user.email.toLowerCase() }],
    };
    if (user.phone) {
      query.$or.push({ phone: user.phone });
    }

    const orders = await Lead.find(query).sort({ createdAt: -1 });
    
    // Mask product key for orders that are not yet confirmed by admin
    const sanitizedOrders = orders.map((order) => {
      const orderObj = order.toObject();
      if (!orderObj.isPaymentConfirmed) {
        orderObj.productKey = 'LOCKED_AWAITING_CONFIRMATION';
      }
      return orderObj;
    });

    res.json(sanitizedOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getMyOrders,
};
