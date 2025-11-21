import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../config/env';
import { JWTPayload } from '../types/Auth';

export class JWTService {
  /**
   * Create an access token with 15-minute expiry
   */
  static createAccessToken(userId: string, email: string): string {
    const payload: JWTPayload = {
      userId,
      email,
    };

    const signOptions: SignOptions = {
      expiresIn: config.jwt.accessTokenExpiry,
      issuer: 'lifeboard-api',
      audience: 'lifeboard-client',
    };

    return jwt.sign(payload, config.jwt.accessSecret, signOptions);
  }

  /**
   * Create a refresh token with 7-day expiry
   */
  static createRefreshToken(userId: string, email: string): string {
    const payload: JWTPayload = {
      userId,
      email,
    };

    return jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshTokenExpiry,
      issuer: 'lifeboard-api',
      audience: 'lifeboard-client',
    });
  }

  /**
   * Verify an access token
   */
  static verifyAccessToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, config.jwt.accessSecret, {
        issuer: 'lifeboard-api',
        audience: 'lifeboard-client',
      }) as JWTPayload;

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Access token has expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid access token');
      } else {
        throw new Error('Token verification failed');
      }
    }
  }

  /**
   * Verify a refresh token
   */
  static verifyRefreshToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, config.jwt.refreshSecret, {
        issuer: 'lifeboard-api',
        audience: 'lifeboard-client',
      }) as JWTPayload;

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Refresh token has expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid refresh token');
      } else {
        throw new Error('Token verification failed');
      }
    }
  }

  /**
   * Get token expiration time
   */
  static getTokenExpiration(token: string): Date | null {
    try {
      const decoded = jwt.decode(token) as any;
      if (decoded && decoded.exp) {
        return new Date(decoded.exp * 1000);
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(token: string): boolean {
    const expiration = this.getTokenExpiration(token);
    if (!expiration) {
      return true;
    }
    return expiration < new Date();
  }
}

export default JWTService;