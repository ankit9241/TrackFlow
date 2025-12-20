import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail } from '../utils/email.js';

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
const forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({ message: 'User not found with that email' });
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  try {
    await sendPasswordResetEmail(user.email, resetToken);

    res.status(200).json({
      success: true,
      message: 'Password reset email sent'
    });
  } catch (err) {
    console.error('Error sending password reset email:', err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return res.status(500).json({ message: 'Email could not be sent' });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
const resetPassword = async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid token or token expired' });
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  // Generate token
  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    token
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// In authController.js
const registerUser = async (req, res, next) => {
  const { email, password } = req.body;
  console.log('Registration attempt for:', email);

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    console.log('User search result:', user ? 'User exists' : 'No user found');

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      email,
      name: req.body.name, // Accept name from body
      password
    });

    // Generate verification token
    const verificationToken = user.getEmailVerificationToken();

    console.log('About to save user');
    await user.save();
    console.log('User saved successfully');

    // Send verification email
    try {
      await sendVerificationEmail(user.email, verificationToken);
      console.log('Verification email sent');
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
    }

    // Generate token
    const token = generateToken(user._id);
    console.log('Token generated');

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        bio: user.bio,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for user email and explicitly include the password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (isMatch) {
      const token = generateToken(user._id);
      res.json({
        token,
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          bio: user.bio,
          createdAt: user.createdAt
        }
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Verify email
// @route   GET /api/auth/verifyemail/:verificationtoken
// @access  Public
const verifyEmail = async (req, res, next) => {
  // Get hashed token
  const verificationToken = crypto
    .createHash('sha256')
    .update(req.params.verificationtoken)
    .digest('hex');

  const user = await User.findOne({
    verificationToken,
    verificationTokenExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid token or token expired' });
  }

  // Set as verified
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpire = undefined;

  await user.save();

  // Send welcome/access granted email after verification
  try {
    await sendWelcomeEmail(user.email);
  } catch (emailError) {
    console.error('Error sending welcome email:', emailError);
  }

  res.status(200).json({
    success: true,
    message: 'Email verified successfully'
  });
};

// @desc    Resend verification email
// @route   POST /api/auth/resendverification
// @access  Public
const resendVerification = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.isVerified) {
    return res.status(400).json({ message: 'Email already verified' });
  }

  const verificationToken = user.getEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  try {
    await sendVerificationEmail(user.email, verificationToken);
    res.status(200).json({ success: true, message: 'Verification email resent' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Email could not be sent' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    res.json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        bio: user.bio,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user password
// @route   PUT /api/auth/update-password
// @access  Private
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide both current and new password' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete user account
// @route   DELETE /api/auth/account
// @access  Private
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    // Import models dynamically to avoid circular dependencies
    const Habit = (await import('../models/Habit.js')).default;
    const HabitEntry = (await import('../models/HabitEntry.js')).default;

    // Delete all user's habits
    await Habit.deleteMany({ userId });

    // Delete all user's habit entries
    await HabitEntry.deleteMany({ user: userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: 'Account and all associated data deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Failed to delete account' });
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

export {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  updateProfile,
  updatePassword,
  deleteAccount
};
