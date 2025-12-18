import express from 'express';
import {
  loginHandler,
  logoutHandler,
  refreshHandler,
  meHandler,
  listLeads,
  listTransactions,
  getTransactionDetail,
  verifyTransactionHandler,
} from '../../controllers/admin.controller.js';
import { requireAdmin } from '../../middlewares/requireAdmin.js';
import {
  createService,
  deleteService,
  deleteSetting,
  getAllServices,
  getAllSettings,
  updateService,
  updateSetting
} from '../../controllers/settings.controller.js';
import { requirePermission } from '../../middlewares/requirePermission.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { createServiceSchema } from '../../utils/zodSchemas.js';

const router = express.Router();

// Auth
router.post('/login', loginHandler);
router.post('/refresh', refreshHandler);
router.post('/logout', requireAdmin, logoutHandler);
router.get('/me', requireAdmin, meHandler);

// Leads & Transactions
router.get('/leads', requireAdmin, listLeads);
router.get('/transactions', requireAdmin, listTransactions);
router.get('/transactions/:id', requireAdmin, getTransactionDetail);
router.post('/transactions/:id/verify', requireAdmin, requirePermission('/transactions/:id/verify'), verifyTransactionHandler);

// Services & Settings (assume all admins can manage)
router.get('/services', requireAdmin, getAllServices);
router.post('/services', requireAdmin, validateRequest(createServiceSchema), createService);
router.put('/services/:id', requireAdmin, updateService);
router.delete('/services/:id', requireAdmin, deleteService);

router.get('/settings', requireAdmin, getAllSettings);
router.put('/settings/:key', requireAdmin, updateSetting);
router.delete('/settings/:key', requireAdmin, deleteSetting);

export default router;
