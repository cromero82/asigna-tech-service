import { NextFunction, Request, Response } from 'express';
import { AppLogger } from '../config/logger';
import { RecursoNoEncontradoError } from '../exceptions/recurso-no-encontrado.error';

function esErrorPostgres(err: unknown): err is { code: string } {
  return typeof err === 'object' && err !== null && 'code' in err;
}

export function unhandledErrorMiddleware(logger: AppLogger) {
  return (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
    if (res.headersSent) {
      return;
    }

    if (err instanceof RecursoNoEncontradoError) {
      logger.info({ err }, 'recurso no encontrado');
      res.status(404).json({ status: 404, message: err.message });
      return;
    }

    if (esErrorPostgres(err) && err.code === '23503') {
      logger.info({ err }, 'referencia inválida');
      res.status(400).json({ status: 400, message: 'Referencia inválida en la solicitud' });
      return;
    }

    logger.error({ err }, 'error no controlado');
    res.status(500).json({ status: 500, message: 'Error interno del servidor' });
  };
}
