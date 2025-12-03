const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Register User
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    if (user) {
      const token = generateToken(user._id);

      // Set cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,        // required with SameSite=None
        sameSite: 'none',    // required for cross-site cookies
        maxAge: 30 * 24 * 60 * 60 * 1000
      });

      res.status(201).json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        },
        token
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Login User
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      const token = generateToken(user._id);

      // Set cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,        // required with SameSite=None
        sameSite: 'none',    // required for cross-site cookies
        maxAge: 30 * 24 * 60 * 60 * 1000
      });

      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        },
        token
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Logout User
const logout = async (req, res) => {
  try {
    res.cookie('token', '', {
      httpOnly: true,
      secure: true,        // required with SameSite=None
      sameSite: 'none',    // required for cross-site cookies
      expires: new Date(0)
    });

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Current User
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe
};