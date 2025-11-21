import { Router } from 'express';
import AuthController from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

/**
 * @route   POST /auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', asyncHandler(AuthController.register));

/**
 * @route   POST /auth/login
 * @desc    Login user and get tokens
 * @access  Public
 */
router.post('/login', asyncHandler(AuthController.login));

/**
 * @route   POST /auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', asyncHandler(AuthController.refreshToken));

/**
 * @route   POST /auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Public
 */
router.post('/logout', asyncHandler(AuthController.logout));

/**
 * @route   GET /auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticate, asyncHandler(AuthController.getProfile));

/**
 * @route   PUT /auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.put('/change-password', authenticate, asyncHandler(AuthController.changePassword));

export default router;