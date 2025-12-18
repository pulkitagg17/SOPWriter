// src/di/container.ts
import { MailService } from '../services/mail.service.js';
import { LeadService } from '../services/lead.service.js';
import { TransactionService } from '../services/transaction.service.js';
import { AuthService } from '../services/auth.service.js';

// Instantiate services with dependencies
const mailService = new MailService();
const leadService = new LeadService(mailService);
const transactionService = new TransactionService();
const authService = new AuthService(mailService);

export { leadService, mailService, transactionService, authService };
