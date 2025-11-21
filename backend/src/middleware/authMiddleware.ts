import { Request, Response, NextFunction } from 'express';
import JWTService from '../utils/jwt';
import ResponseService from '../utils/response';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      ResponseService.unauthorized(res, 'No authorization header provided');
      return;
    }

    // Check if header format is correct (Bearer token)
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      ResponseService.unauthorized(res, 'Invalid authorization header format');
      return;
    }

    const token = parts[1];

    // Verify the token
    const decoded = JWTService.verifyAccessToken(token);

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    if (error instanceof Error) {
      ResponseService.unauthorized(res, error.message);
    } else {
      ResponseService.unauthorized(res, 'Token verification failed');
    }
  }
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      // No auth header, continue without user
      next();
      return;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      // Invalid format, continue without user
      next();
      return;
    }

    const token = parts[1];

    // Try to verify the token
    const decoded = JWTService.verifyAccessToken(token);

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    // Token verification failed, continue without user
    next();
  }
};

export default {
  authenticate,
  optionalAuth,
};