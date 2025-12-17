// tracker.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import { 
  getMonthlyTracking,
  updateHabitEntry,
  getStreaks
} from '../controllers/trackerController.js';

const router = express.Router();

// Get monthly tracking data
router.get('/:year/:month', protect, getMonthlyTracking);

// Update a habit entry (mark as complete/incomplete)
router.put('/update', protect, updateHabitEntry);

// Get streak data for all habits
router.get('/streaks', protect, getStreaks);

export default router;