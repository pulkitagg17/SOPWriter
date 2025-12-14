import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { config_vars } from './config/env.js';
import publicLeadsRoutes from './routes/public/leads.routes.js';
import publicTransactionsRoutes from './routes/public/transactions.routes.js';
import configRoutes from './routes/public/config.routes.js';
import adminRoutes from './routes/admin/admin.routes.js';
import { requestLogger } from './middlewares/requestLogger.js';
import errorHandler from './middlewares/errorHandler.js';

export function createApp() {
  const app = express();

  // Trust first proxy (for IP extraction)
  app.set('trust proxy', 1);

  // Security & compression
  app.use(helmet());
  app.use(cors({ origin: config_vars.cors.origin, credentials: true }));
  app.use(
    compression({
      filter: (req, res) => {
        if (req.headers['x-no-compression']) {
          return false;
        }
        return compression.filter(req, res);
      },
      level: 6,
    })
  );
  app.use(express.json({ limit: '10kb' }));
  app.use(cookieParser());

  // cross-cutting
  app.use(requestLogger);

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API v1 routes
  app.use('/api/v1', publicLeadsRoutes);
  app.use('/api/v1', publicTransactionsRoutes);
  app.use('/api/v1/config', configRoutes);

  // Admin routes matching exact requirement /api/admin
  app.use('/api/admin', adminRoutes);

  // error handler must be last
  app.use(errorHandler);

  return app;
}
