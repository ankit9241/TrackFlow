import express from 'express';
import { protect } from '../middleware/auth.js';
import { 
  toggleHabitCompletion, 
  getUserCompletions 
} from '../controllers/habitCompletionController.js';

const router = express.Router();

router.route('/')
  .post(protect, toggleHabitCompletion)
  .get(protect, getUserCompletions);

export default router;