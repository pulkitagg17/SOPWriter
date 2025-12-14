import { CreateLeadDTO, CreateTransactionDTO, VerifyTransactionDTO } from '../utils/zodSchemas.js';

declare global {
  namespace Express {
    interface Request {
      validatedBody?: CreateLeadDTO | CreateTransactionDTO | VerifyTransactionDTO | any;
      admin?: {
        sub: string;
        email?: string;
        id?: string;
        role?: string;
      };
      requestId?: string;
    }
  }
}

export {};
