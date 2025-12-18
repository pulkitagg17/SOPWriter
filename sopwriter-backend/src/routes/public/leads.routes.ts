import express from 'express';
import { z } from 'zod';
import { createLeadHandler, getLeadPublic } from '../../controllers/leads.controller.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { createLeadSchema } from '../../utils/zodSchemas.js';
import { leadsRateLimiter } from '../../middlewares/rateLimiter.js';

const router = express.Router();

const leadIdParamSchema = z.object({
    leadId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid lead id'),
});

router.post(
    '/leads',
    leadsRateLimiter,
    validateRequest(createLeadSchema),
    createLeadHandler
);

router.get(
    '/leads/:leadId',
    leadsRateLimiter,
    validateRequest(leadIdParamSchema, 'params'),
    getLeadPublic
);

export default router;
