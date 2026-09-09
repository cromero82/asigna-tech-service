import { NextFunction, Request, Response } from 'express';
import { RecursoNoEncontradoError } from '../exceptions/recurso-no-encontrado.error';
import { ReglaNegocioError } from '../exceptions/regla-negocio.error';
import { ValidacionError } from '../exceptions/validacion.error';
import { unhandledErrorMiddleware } from './unhandled-error.middleware';
import { loggerSilencioso } from '../test/helpers';

function respuestaMock() {
  const res = {
    headersSent: false,
    statusCode: 0,
    body: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    }
  };
  return res as unknown as Response & { statusCode: number; body: unknown };
}

describe('unhandledErrorMiddleware', () => {
  const next = jest.fn() as NextFunction;
  const req = {} as Request;
  const handler = unhandledErrorMiddleware(loggerSilencioso);

  it('no escribe si ya se enviaron cabeceras', () => {
    const res = respuestaMock();
    (res as { headersSent: boolean }).headersSent = true;
    handler(new ValidacionError('x'), req, res, next);
    expect(res.statusCode).toBe(0);
  });

  it('mapea 404, 400 y 412', () => {
    const casos: Array<[Error, number]> = [
      [new RecursoNoEncontradoError('Solicitud', 9), 404],
      [new ValidacionError('titulo es obligatorio'), 400],
      [new ReglaNegocioError('sin técnico'), 412]
    ];
    for (const [err, status] of casos) {
      const res = respuestaMock();
      handler(err, req, res, next);
      expect(res.statusCode).toBe(status);
    }
  });

  it('trata JSON inválido y errores Postgres', () => {
    const json = new SyntaxError('Unexpected token');
    (json as SyntaxError & { body: string }).body = '{';
    const resJson = respuestaMock();
    handler(json, req, resJson, next);
    expect(resJson.statusCode).toBe(400);

    const fk = { code: '23503' };
    const resFk = respuestaMock();
    handler(fk, req, resFk, next);
    expect(resFk.body).toEqual({ status: 400, message: 'Referencia inválida' });

    const dup = { code: '23505' };
    const resDup = respuestaMock();
    handler(dup, req, resDup, next);
    expect(resDup.body).toEqual({
      status: 400,
      message: 'Ya existe un registro con esos datos'
    });
  });

  it('mapea cuerpo demasiado grande a 413', () => {
    const res = respuestaMock();
    handler({ type: 'entity.too.large', status: 413 }, req, res, next);
    expect(res.statusCode).toBe(413);
    expect(res.body).toEqual({ status: 413, message: 'Cuerpo demasiado grande' });
  });

  it('envuelve el resto en 500', () => {
    const res = respuestaMock();
    handler(new Error('boom'), req, res, next);
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ status: 500, message: 'Error interno del servidor' });
  });
});
