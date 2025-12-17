import express from 'express';
import { protect } from '../middleware/auth.js';
import { registerUser, loginUser, getMe } from '../controllers/authController.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route
router.get('/me', protect, getMe);

export default router;
