import pino, { Logger } from 'pino';

const isDev = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

const baseLogger = pino({
  level: process.env.LOG_LEVEL || (isTest ? 'silent' : 'info'),
  base: undefined,
  transport: isDev
    ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    }
    : undefined,
});

export const logger = baseLogger;

export function getLoggerWithContext(requestId: string): Logger {
  return baseLogger.child({ requestId });
}
