import { Router } from 'express';
import GoalsController from '../controllers/goalsController';
import { authenticate } from '../middleware/authMiddleware';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

/**
 * @route   GET /goals
 * @desc    Get all goals for the authenticated user
 * @access  Private
 */
router.get('/', authenticate, asyncHandler(GoalsController.getGoals));

/**
 * @route   GET /goals/stats
 * @desc    Get goal statistics for the user
 * @access  Private
 */
router.get('/stats', authenticate, asyncHandler(GoalsController.getGoalStats));

/**
 * @route   GET /goals/status/:status
 * @desc    Get goals by status
 * @access  Private
 */
router.get('/status/:status', authenticate, asyncHandler(GoalsController.getGoalsByStatus));

/**
 * @route   GET /goals/:id
 * @desc    Get a specific goal by ID
 * @access  Private
 */
router.get('/:id', authenticate, asyncHandler(GoalsController.getGoalById));

/**
 * @route   POST /goals
 * @desc    Create a new goal
 * @access  Private
 */
router.post('/', authenticate, asyncHandler(GoalsController.createGoal));

/**
 * @route   PUT /goals/:id
 * @desc    Update an existing goal
 * @access  Private
 */
router.put('/:id', authenticate, asyncHandler(GoalsController.updateGoal));

/**
 * @route   PUT /goals/:id/toggle
 * @desc    Toggle goal status (quick action)
 * @access  Private
 */
router.put('/:id/toggle', authenticate, asyncHandler(GoalsController.toggleGoalStatus));

/**
 * @route   DELETE /goals/:id
 * @desc    Delete a goal
 * @access  Private
 */
router.delete('/:id', authenticate, asyncHandler(GoalsController.deleteGoal));

export default router;