import mongoose from 'mongoose';
import { config_vars } from './env.js';
import { logger } from './logger.js';
import { CONNECTION_POOL, TIMEOUT } from '../constants/index.js';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(config_vars.mongoUri, {
      maxPoolSize: CONNECTION_POOL.MAX_SIZE,
      minPoolSize: CONNECTION_POOL.MIN_SIZE,
      socketTimeoutMS: TIMEOUT.SOCKET_MS,
      serverSelectionTimeoutMS: TIMEOUT.SERVER_SELECTION_MS,
      family: 4, // Use IPv4, skip IPv6
    });

    logger.info(
      { uri: config_vars.mongoUri.replace(/:\/\/.*@/, '://***@') },
      'MongoDB connected successfully'
    );
  } catch (error) {
    logger.error({ err: error }, 'MongoDB connection failed');
    process.exit(1);
  }
};

mongoose.connection.on('error', (error: Error) => {
  logger.error({ err: error }, 'MongoDB runtime error');
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  logger.info('MongoDB reconnected');
});
