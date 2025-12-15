import express from 'express';
import { requireAdmin } from '../../middlewares/auth.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { verifyTransactionSchema } from '../../utils/zodSchemas.js';
import {
  loginRateLimiter,
  otpRateLimiter,
  forgotPasswordRateLimiter,
  resetPasswordRateLimiter,
} from '../../middlewares/rateLimiter.js';
import {
  listTransactions,
  listLeads,
  getTransactionDetail,
  verifyTransactionHandler,
  loginHandler,
  logoutHandler,
  meHandler,
  forgotPasswordHandler,
  verifyOtpHandler,
  resetPasswordHandler,
  refreshHandler,
} from '../../controllers/admin.controller.js';
import {
  getAllServices,
  createService,
  updateService,
  deleteService,
  bulkUpdateServices,
  getAllSettings,
  updateSetting,
  deleteSetting,
} from '../../controllers/settings.controller.js';
import {
  loginSchema,
  forgotPasswordSchema,
  verifyOtpSchema,
  resetPasswordSchema,
  createServiceSchema,
  updateServiceSchema,
  updateSettingSchema,
} from '../../utils/zodSchemas.js';
import { validateOrigin } from '../../middlewares/security.js';

const router = express.Router();

// Apply CSRF protection (Origin check) to all admin routes
router.use(validateOrigin);

// Auth Routes
router.post('/login', loginRateLimiter, validateRequest(loginSchema), loginHandler);
router.post('/logout', logoutHandler);
router.get('/me', requireAdmin, meHandler);
router.post('/forgot-password', forgotPasswordRateLimiter, validateRequest(forgotPasswordSchema), forgotPasswordHandler);
router.post('/verify-otp', otpRateLimiter, validateRequest(verifyOtpSchema), verifyOtpHandler);
router.post('/reset-password', resetPasswordRateLimiter, validateRequest(resetPasswordSchema), resetPasswordHandler);
router.post('/refresh', refreshHandler); // No auth middleware, relies on cookie

// apply auth to all admin routes below
router.use(requireAdmin);

router.get('/leads', listLeads);
router.get('/transactions', listTransactions);
router.get('/transactions/:id', getTransactionDetail);
router.post(
  '/transactions/:id/verify',
  validateRequest(verifyTransactionSchema),
  verifyTransactionHandler
);

// Services Management
router.get('/services', getAllServices);
router.post('/services', validateRequest(createServiceSchema), createService);
router.put('/services/bulk', bulkUpdateServices);
router.put('/services/:id', validateRequest(updateServiceSchema), updateService);
router.delete('/services/:id', deleteService);

// Settings Management
router.get('/settings', getAllSettings);
router.put('/settings/:key', validateRequest(updateSettingSchema), updateSetting);
router.delete('/settings/:key', deleteSetting);

export default router;
