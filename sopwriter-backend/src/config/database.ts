import mongoose from 'mongoose';
import { config_vars } from './env.js';
import { logger } from './logger.js';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(config_vars.mongoUri, {
      maxPoolSize: 10,
      socketTimeoutMS: 30000,
      serverSelectionTimeoutMS: 5000,
      family: 4,
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
