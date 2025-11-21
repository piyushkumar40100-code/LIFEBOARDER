import { Request, Response } from 'express';
import { z } from 'zod';
import UserModel from '../models/User';
import JWTService from '../utils/jwt';
import PasswordService from '../utils/passwords';
import ResponseService from '../utils/response';
import { CustomError } from '../middleware/errorHandler';
import { LoginData, RegisterData, AuthTokens } from '../types/Auth';

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export class AuthController {
  /**
   * Register a new user
   */
  static async register(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const validatedData = registerSchema.parse(req.body) as RegisterData;

      // Validate password strength
      const passwordValidation = PasswordService.validatePassword(validatedData.password);
      if (!passwordValidation.isValid) {
        ResponseService.validationError(res, passwordValidation.errors);
        return;
      }

      // Check if user already exists
      const existingUser = await UserModel.findByEmail(validatedData.email);
      if (existingUser) {
        ResponseService.conflict(res, 'Email already exists');
        return;
      }

      // Hash password
      const hashedPassword = await PasswordService.hashPassword(validatedData.password);

      // Create user
      const newUser = await UserModel.create({
        email: validatedData.email,
        password_hash: hashedPassword,
      });

      // Generate tokens
      const tokens: AuthTokens = {
        accessToken: JWTService.createAccessToken(newUser.id, newUser.email),
        refreshToken: JWTService.createRefreshToken(newUser.id, newUser.email),
      };

      // Return success response without password hash
      const userResponse = {
        id: newUser.id,
        email: newUser.email,
        created_at: newUser.created_at,
        updated_at: newUser.updated_at,
        last_login: newUser.last_login,
      };

      ResponseService.created(res, {
        user: userResponse,
        tokens,
      }, 'User registered successfully');
    } catch (error) {
      if (error instanceof z.ZodError) {
        ResponseService.validationError(res, error.errors.map(e => e.message));
      } else {
        throw error;
      }
    }
  }

  /**
   * Login user
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const validatedData = loginSchema.parse(req.body) as LoginData;

      // Find user by email
      const user = await UserModel.findByEmail(validatedData.email);
      if (!user) {
        ResponseService.unauthorized(res, 'Invalid email or password');
        return;
      }

      // Compare passwords
      const isPasswordValid = await PasswordService.comparePassword(
        validatedData.password,
        user.password_hash
      );

      if (!isPasswordValid) {
        ResponseService.unauthorized(res, 'Invalid email or password');
        return;
      }

      // Update last login
      await UserModel.updateLastLogin(user.id);

      // Generate tokens
      const tokens: AuthTokens = {
        accessToken: JWTService.createAccessToken(user.id, user.email),
        refreshToken: JWTService.createRefreshToken(user.id, user.email),
      };

      // Return success response without password hash
      const userResponse = {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
        last_login: user.last_login,
      };

      ResponseService.success(res, {
        user: userResponse,
        tokens,
      }, 'Login successful');
    } catch (error) {
      if (error instanceof z.ZodError) {
        ResponseService.validationError(res, error.errors.map(e => e.message));
      } else {
        throw error;
      }
    }
  }

  /**
   * Refresh access token
   */
  static async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const { refreshToken } = refreshTokenSchema.parse(req.body);

      // Verify refresh token
      const decoded = JWTService.verifyRefreshToken(refreshToken);

      // Find user to ensure they still exist
      const user = await UserModel.findById(decoded.userId);
      if (!user) {
        ResponseService.unauthorized(res, 'User not found');
        return;
      }

      // Generate new access token
      const newAccessToken = JWTService.createAccessToken(user.id, user.email);

      ResponseService.success(res, {
        accessToken: newAccessToken,
      }, 'Token refreshed successfully');
    } catch (error) {
      if (error instanceof z.ZodError) {
        ResponseService.validationError(res, error.errors.map(e => e.message));
      } else if (error instanceof Error) {
        ResponseService.unauthorized(res, error.message);
      } else {
        throw error;
      }
    }
  }

  /**
   * Logout user (client-side token removal)
   */
  static async logout(req: Request, res: Response): Promise<void> {
    try {
      // In a stateless JWT setup, logout is mainly a client-side operation
      // Here we just return a success response
      // In production, you might want to implement token blacklisting
      ResponseService.success(res, null, 'Logout successful');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get current user profile
   */
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseService.unauthorized(res, 'User not authenticated');
        return;
      }

      const user = await UserModel.findById(req.user.userId);
      if (!user) {
        ResponseService.notFound(res, 'User not found');
        return;
      }

      // Return user data without password hash
      const userResponse = {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
        last_login: user.last_login,
      };

      ResponseService.success(res, userResponse);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Change password
   */
  static async changePassword(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseService.unauthorized(res, 'User not authenticated');
        return;
      }

      const changePasswordSchema = z.object({
        currentPassword: z.string().min(1, 'Current password is required'),
        newPassword: z.string().min(8, 'New password must be at least 8 characters'),
      });

      const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);

      // Find user
      const user = await UserModel.findById(req.user.userId);
      if (!user) {
        ResponseService.notFound(res, 'User not found');
        return;
      }

      // Verify current password
      const isCurrentPasswordValid = await PasswordService.comparePassword(
        currentPassword,
        user.password_hash
      );

      if (!isCurrentPasswordValid) {
        ResponseService.unauthorized(res, 'Current password is incorrect');
        return;
      }

      // Validate new password strength
      const passwordValidation = PasswordService.validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        ResponseService.validationError(res, passwordValidation.errors);
        return;
      }

      // Hash new password
      const hashedNewPassword = await PasswordService.hashPassword(newPassword);

      // Update password
      await UserModel.update(user.id, {
        password_hash: hashedNewPassword,
      });

      ResponseService.success(res, null, 'Password changed successfully');
    } catch (error) {
      if (error instanceof z.ZodError) {
        ResponseService.validationError(res, error.errors.map(e => e.message));
      } else {
        throw error;
      }
    }
  }
}

export default AuthController;