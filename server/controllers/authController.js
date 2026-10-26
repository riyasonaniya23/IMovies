const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'imovies_super_secret_jwt_key_2026',
    { expiresIn: '7d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      throw new Error('User with this email already exists');
    }

    const assignedRole = role === 'admin' ? 'admin' : 'user';
    const user = await User.create({
      name,
      email,
      phone: phone || '9876543210',
      password,
      role: assignedRole,
    });

    if (assignedRole === 'admin') {
      await Admin.create({
        userId: user._id,
        name: user.name,
        email: user.email,
      });
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      watchlist: user.watchlist,
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user / admin
// @route   POST /api/auth/login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate('watchlist');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        watchlist: user.watchlist,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Get logged-in user profile
// @route   GET /api/auth/profile
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('watchlist');
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updated = await user.save();
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      role: updated.role,
      token: generateToken(updated._id, updated.role),
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle movie in user watchlist
// @route   POST /api/auth/watchlist/:movieId
const toggleWatchlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const { movieId } = req.params;
    const exists = user.watchlist.some((id) => id.toString() === movieId);

    if (exists) {
      user.watchlist = user.watchlist.filter((id) => id.toString() !== movieId);
    } else {
      user.watchlist.push(movieId);
    }
    await user.save();
    const populatedUser = await User.findById(req.user._id)
      .select('-password')
      .populate('watchlist');
    res.json(populatedUser.watchlist);
  } catch (err) {
    next(err);
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/auth/users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  toggleWatchlist,
  getAllUsers,
};
