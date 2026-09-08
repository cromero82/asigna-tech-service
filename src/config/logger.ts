import pino from 'pino';
import { appConfig } from './app-config';

export type AppLogger = pino.Logger;

export function createLogger(): AppLogger {
  return pino({
    level: appConfig.logLevel,
    redact: {
      paths: ['password', '*.password', 'req.headers.authorization'],
      censor: '[redacted]'
    }
  });
}
