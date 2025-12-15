import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';
import { config_vars } from './config/env.js';
import { logger } from './config/logger.js';
import mongoose from 'mongoose';
import type { Server } from 'http';

let server: Server | null = null;

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    const app = createApp();

    server = app.listen(config_vars.port, () => {
      logger.info(
        { port: config_vars.port, env: config_vars.nodeEnv },
        'Server started successfully'
      );
    });
  } catch (error) {
    logger.error({ err: error }, 'Failed to start server');
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info({ signal }, 'Graceful shutdown initiated');

  if (server) {
    server.close();
  }

  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    logger.error({ err: error }, 'Error during shutdown');
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer();
