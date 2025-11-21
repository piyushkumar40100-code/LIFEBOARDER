import express, { Application } from 'express';
import cors from 'cors';
import config from './config/env';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { authenticate } from './middleware/authMiddleware';

// Import routes (will be created later)
// import authRoutes from './routes/auth';
// import goalsRoutes from './routes/goals';

const createApp = (): Application => {
  const app: Application = express();

  // Request logging middleware
  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url} - ${req.ip}`);
    next();
  });

  // CORS configuration
  app.use(cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }));

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      success: true,
      message: 'LifeBoard API is running',
      timestamp: new Date().toISOString(),
      environment: config.environment,
      version: '1.0.0',
    });
  });

  // API routes
  app.use('/api/v1', (req, res, next) => {
    console.log(`API Request: ${req.method} ${req.url}`);
    next();
  });

  // Placeholder routes (will be implemented)
  app.get('/api/v1/test', (req, res) => {
    res.json({
      success: true,
      message: 'API is working',
      data: null,
    });
  });

  // Mount routes (will uncomment when implemented)
  // app.use('/api/v1/auth', authRoutes);
  // app.use('/api/v1/goals', authenticate, goalsRoutes);

  // 404 handler for undefined routes
  app.use(notFoundHandler);

  // Global error handler
  app.use(errorHandler);

  return app;
};

export default createApp;