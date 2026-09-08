import { NextFunction, Request, Response } from 'express';
import { AppLogger } from '../config/logger';
import { RecursoNoEncontradoError } from '../exceptions/recurso-no-encontrado.error';
import { ReglaNegocioError } from '../exceptions/regla-negocio.error';
import { ValidacionError } from '../exceptions/validacion.error';

function esErrorPostgres(err: unknown): err is { code: string } {
  return typeof err === 'object' && err !== null && 'code' in err;
}

function esJsonInvalido(err: unknown): boolean {
  return err instanceof SyntaxError && 'body' in err;
}

function esCuerpoGrande(err: unknown): boolean {
  if (typeof err !== 'object' || err === null) {
    return false;
  }
  const e = err as { type?: string; status?: number; statusCode?: number };
  return e.type === 'entity.too.large' || e.status === 413 || e.statusCode === 413;
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

    if (err instanceof ValidacionError) {
      logger.info({ err }, 'validación de catálogo o solicitud');
      res.status(400).json({ status: 400, message: err.message });
      return;
    }

    if (err instanceof ReglaNegocioError) {
      logger.info({ err }, 'regla de negocio');
      res.status(412).json({ status: 412, message: err.message });
      return;
    }

    if (esJsonInvalido(err)) {
      logger.info({ err }, 'JSON inválido');
      res.status(400).json({ status: 400, message: 'JSON inválido' });
      return;
    }

    if (esCuerpoGrande(err)) {
      logger.info('cuerpo demasiado grande');
      res.status(413).json({ status: 413, message: 'Cuerpo demasiado grande' });
      return;
    }

    if (esErrorPostgres(err) && err.code === '23503') {
      logger.info({ err }, 'referencia inválida');
      res.status(400).json({ status: 400, message: 'Referencia inválida' });
      return;
    }

    if (esErrorPostgres(err) && err.code === '23505') {
      logger.info({ err }, 'registro duplicado');
      res.status(400).json({ status: 400, message: 'Ya existe un registro con esos datos' });
      return;
    }

    logger.error({ err }, 'error no controlado');
    res.status(500).json({ status: 500, message: 'Error interno del servidor' });
  };
}
