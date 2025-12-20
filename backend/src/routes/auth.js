import express from 'express';
import { protect } from '../middleware/auth.js';
import { registerUser, loginUser, getMe, forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

// Protected route
router.get('/me', protect, getMe);

export default router;
