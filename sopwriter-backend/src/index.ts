import mongoose from 'mongoose';
import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';
import { config_vars } from './config/env.js';
import { logger } from './config/logger.js';
import type { Server } from 'http';

let server: Server | null = null;

async function start() {
  try {
    await connectDatabase();

    const app = createApp();

    server = app.listen(config_vars.port, () => {
      logger.info(
        { port: config_vars.port, env: config_vars.nodeEnv },
        'Server started'
      );
    });
  } catch (err) {
    logger.error({ err }, 'Startup failed');
    process.exit(1);
  }
}

async function shutdown(signal: string) {
  logger.info({ signal }, 'Shutting down');

  if (server) {
    server.close();
  }

  await mongoose.connection.close();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

start();
