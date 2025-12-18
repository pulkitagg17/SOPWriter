import express from 'express';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { createTransactionSchema } from '../../utils/zodSchemas.js';
import { declareTransactionHandler } from '../../controllers/transactions.controller.js';
import { transactionsRateLimiter } from '../../middlewares/rateLimiter.js';

const router = express.Router({ mergeParams: true });

router.post(
  '/leads/:leadId/transactions',
  transactionsRateLimiter,
  validateRequest(createTransactionSchema, 'body'),
  declareTransactionHandler
);

export default router;
