import pino from 'pino';

export type AppLogger = pino.Logger;

export function createLogger(): AppLogger {
  return pino({
    level: 'info',
    redact: ['password', 'req.headers.authorization']
  });
}
