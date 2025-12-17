import express from 'express';
import { protect } from '../middleware/auth.js';
import { 
  createHabit, 
  getHabits, 
  updateHabit, 
  deleteHabit,
  getMonthlyAnalytics 
} from '../controllers/habitController.js';

const router = express.Router();

// Protect all routes with authentication middleware
router.use(protect);

// Habit routes
router.route('/')
  .get(getHabits)
  .post(createHabit);

router.route('/:id')
  .put(updateHabit)
  .delete(deleteHabit);

// Analytics route
router.get('/analytics/:year/:month', getMonthlyAnalytics);

export default router;
