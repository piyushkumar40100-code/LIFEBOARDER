import dotenv from 'dotenv';
import config from './config/env';
import createApp from './app';

// Load environment variables
dotenv.config();

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`🚀 LifeBoard API Server is running`);
  console.log(`📍 Server URL: http://localhost:${config.port}`);
  console.log(`🌍 Environment: ${config.environment}`);
  console.log(`📊 Health Check: http://localhost:${config.port}/health`);
  console.log(`🧪 API Test: http://localhost:${config.port}/api/v1/test`);
});

// Graceful shutdown handling
const gracefulShutdown = (signal: string) => {
  console.log(`\n📡 Received ${signal}. Starting graceful shutdown...`);

  server.close((err) => {
    if (err) {
      console.error('❌ Error during server shutdown:', err);
      process.exit(1);
    }

    console.log('✅ Server closed successfully');
    process.exit(0);
  });

  // Force shutdown if graceful shutdown takes too long
  setTimeout(() => {
    console.error('❌ Forced shutdown due to timeout');
    process.exit(1);
  }, 10000);
};

// Handle termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

export default server;