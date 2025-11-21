const jwt = require('jsonwebtoken');
const config = require('../config/env');

class JWTService {
  static createAccessToken(userId, email) {
    return jwt.sign(
      { userId, email },
      config.jwt.accessSecret,
      {
        expiresIn: '15m',
        issuer: 'lifeboard-api',
        audience: 'lifeboard-client'
      }
    );
  }

  static createRefreshToken(userId, email) {
    return jwt.sign(
      { userId, email },
      config.jwt.refreshSecret,
      {
        expiresIn: '7d',
        issuer: 'lifeboard-api',
        audience: 'lifeboard-client'
      }
    );
  }

  static verifyAccessToken(token) {
    return jwt.verify(token, config.jwt.accessSecret, {
      issuer: 'lifeboard-api',
      audience: 'lifeboard-client'
    });
  }

  static verifyRefreshToken(token) {
    return jwt.verify(token, config.jwt.refreshSecret, {
      issuer: 'lifeboard-api',
      audience: 'lifeboard-client'
    });
  }
}

module.exports = JWTService;