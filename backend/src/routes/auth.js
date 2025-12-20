import express from 'express';
import { protect } from '../middleware/auth.js';
import {
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
} from '../controllers/authController.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.get('/verifyemail/:verificationtoken', verifyEmail);
router.post('/resendverification', resendVerification);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/update-password', protect, updatePassword);
router.delete('/account', protect, deleteAccount);

export default router;
