// analytics.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import { 
  getHabitAnalytics,
  getHabitStreaks,
  getMonthlyCompletion
} from '../controllers/analyticsController.js';

const router = express.Router();

// Get analytics for a habit
router.get('/:habitId', protect, getHabitAnalytics);

// Get streak data for a habit
router.get('/:habitId/streaks', protect, getHabitStreaks);

// Get monthly completion data
router.get('/monthly/:year/:month', protect, getMonthlyCompletion);

export default router;