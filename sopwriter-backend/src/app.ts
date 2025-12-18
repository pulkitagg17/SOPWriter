import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { config_vars } from './config/env.js';
import publicLeadsRoutes from './routes/public/leads.routes.js';
import publicTransactionsRoutes from './routes/public/transactions.routes.js';
import configRoutes from './routes/public/config.routes.js';
import adminRoutes from './routes/admin/admin.routes.js';
import errorHandler from './middlewares/errorHandler.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: config_vars.cors.origin, credentials: true }));
  app.use(compression());
  app.use(express.json({ limit: '10kb' }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/v1', publicLeadsRoutes);
  app.use('/api/v1', publicTransactionsRoutes);
  app.use('/api/v1/config', configRoutes);
  app.use('/api/admin', adminRoutes);

  app.use(errorHandler);

  return app;
}

const app = createApp();
export default app;
