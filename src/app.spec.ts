import request from 'supertest';
import { RecursoNoEncontradoError } from './exceptions/recurso-no-encontrado.error';
import { ReglaNegocioError } from './exceptions/regla-negocio.error';
import { crearAppPrueba } from './test/helpers';

const alta = {
  titulo: 'Cambio de tóner',
  tipoTecnicoId: 1,
  tipoServicioId: 2
};

describe('HTTP solicitudes y health', () => {
  it('GET /health 200 y 503', async () => {
    const up = crearAppPrueba();
    await request(up.app).get('/health').expect(200, { status: 'UP', database: 'UP' });

    const down = crearAppPrueba({
      healthService: {
        check: jest.fn().mockResolvedValue({ status: 'DOWN', database: 'DOWN' })
      }
    });
    await request(down.app).get('/health').expect(503);
  });

  it('CRUD de solicitudes con códigos HTTP', async () => {
    const creada = { id: 1, titulo: alta.titulo };
    const { app, solicitudService } = crearAppPrueba({
      solicitudService: {
        crear: jest.fn().mockResolvedValue(creada),
        obtenerPorId: jest.fn().mockResolvedValue(creada),
        actualizar: jest.fn().mockResolvedValue(creada),
        eliminar: jest.fn().mockResolvedValue(undefined)
      }
    });

    await request(app).get('/api/solicitudes').expect(200, []);
    await request(app).get('/api/solicitudes/1').expect(200);
    await request(app).post('/api/solicitudes').send(alta).expect(201);
    await request(app)
      .put('/api/solicitudes/1')
      .send({ ...alta, estadoId: 1, prioridadId: 2 })
      .expect(200);
    await request(app).delete('/api/solicitudes/1').expect(204);
    expect(solicitudService.eliminar).toHaveBeenCalledWith(1);
  });

  it('valida id de ruta y cuerpo', async () => {
    const { app } = crearAppPrueba();
    await request(app).get('/api/solicitudes/abc').expect(400);
    await request(app).post('/api/solicitudes').send({}).expect(400);
    await request(app)
      .post('/api/solicitudes')
      .set('Content-Type', 'application/json')
      .send('{"titulo":')
      .expect(400)
      .expect({ status: 400, message: 'JSON inválido' });
  });

  it('propaga 404 y 412 del servicio', async () => {
    const { app } = crearAppPrueba({
      solicitudService: {
        obtenerPorId: jest.fn().mockRejectedValue(new RecursoNoEncontradoError('Solicitud', 9)),
        crear: jest
          .fn()
          .mockRejectedValue(new ReglaNegocioError('Una solicitud sin técnico debe quedar en Pendiente'))
      }
    });
    await request(app).get('/api/solicitudes/9').expect(404);
    await request(app).post('/api/solicitudes').send(alta).expect(412);
  });

  it('devuelve 500 si el servicio explota', async () => {
    const { app } = crearAppPrueba({
      solicitudService: { listar: jest.fn().mockRejectedValue(new Error('boom')) },
      healthService: { check: jest.fn().mockRejectedValue(new Error('boom')) }
    });
    await request(app).get('/api/solicitudes').expect(500);
    await request(app).get('/health').expect(500);
  });

  it('publica OpenAPI', async () => {
    const { app } = crearAppPrueba();
    const res = await request(app).get('/v3/api-docs').expect(200);
    expect(res.body.openapi).toBe('3.0.3');
  });
});

describe('HTTP catálogos', () => {
  it('lista y filtra', async () => {
    const { app, catalogoService } = crearAppPrueba();
    await request(app).get('/api/tipos-tecnico').expect(200, []);
    await request(app).get('/api/servicios').expect(200, []);
    await request(app).get('/api/tipos-servicio?tipoTecnicoId=1').expect(200, []);
    await request(app).get('/api/tecnicos').expect(200, []);
    await request(app).get('/api/objetos').expect(200, []);
    await request(app).get('/api/estados-solicitud').expect(200, []);
    await request(app).get('/api/prioridades').expect(200, []);
    await request(app).get('/api/resultados-solicitud').expect(200, []);
    await request(app).get('/api/tipos-servicio?tipoTecnicoId=x').expect(400);
    expect(catalogoService.listarTiposServicio).toHaveBeenCalledWith(1);
  });

  it('propaga errores de catálogo', async () => {
    const { app } = crearAppPrueba({
      catalogoService: {
        listarObjetos: jest.fn().mockRejectedValue(new Error('boom'))
      }
    });
    await request(app).get('/api/objetos').expect(500);
  });

  it('escribe y borra objetos', async () => {
    const { app, catalogoService } = crearAppPrueba({
      catalogoService: {
        crearObjeto: jest.fn().mockResolvedValue({ id: 5, nombre: 'Switch' }),
        actualizarObjeto: jest.fn().mockResolvedValue({ id: 5, nombre: 'Switch core' }),
        eliminarObjeto: jest.fn().mockResolvedValue(undefined),
        crearTipoTecnico: jest.fn().mockResolvedValue({ id: 1, nombre: 'Redes' }),
        actualizarTipoTecnico: jest.fn().mockResolvedValue({ id: 1, nombre: 'Redes' }),
        eliminarTipoTecnico: jest.fn().mockResolvedValue(undefined),
        crearTipoServicio: jest
          .fn()
          .mockResolvedValue({ id: 2, nombre: 'Cableado', tipoTecnicoId: 1 }),
        actualizarTipoServicio: jest
          .fn()
          .mockResolvedValue({ id: 2, nombre: 'Cableado', tipoTecnicoId: 1 }),
        eliminarTipoServicio: jest.fn().mockResolvedValue(undefined),
        crearTecnico: jest
          .fn()
          .mockResolvedValue({ id: 3, nombre: 'Ana', correo: null, tipoTecnicoId: 1 }),
        actualizarTecnico: jest
          .fn()
          .mockResolvedValue({ id: 3, nombre: 'Ana', correo: null, tipoTecnicoId: 1 }),
        eliminarTecnico: jest.fn().mockResolvedValue(undefined)
      }
    });
    await request(app).post('/api/objetos').send({ nombre: 'Switch' }).expect(201);
    await request(app).put('/api/objetos/5').send({ nombre: 'Switch core' }).expect(200);
    await request(app).delete('/api/objetos/5').expect(204);
    await request(app).post('/api/tipos-tecnico').send({ nombre: 'Redes' }).expect(201);
    await request(app).put('/api/tipos-tecnico/1').send({ nombre: 'Redes' }).expect(200);
    await request(app).delete('/api/tipos-tecnico/1').expect(204);
    await request(app)
      .post('/api/tipos-servicio')
      .send({ nombre: 'Cableado', tipoTecnicoId: 1 })
      .expect(201);
    await request(app)
      .put('/api/tipos-servicio/2')
      .send({ nombre: 'Cableado', tipoTecnicoId: 1 })
      .expect(200);
    await request(app).delete('/api/tipos-servicio/2').expect(204);
    await request(app).post('/api/tecnicos').send({ nombre: 'Ana', tipoTecnicoId: 1 }).expect(201);
    await request(app).put('/api/tecnicos/3').send({ nombre: 'Ana', tipoTecnicoId: 1 }).expect(200);
    await request(app).delete('/api/tecnicos/3').expect(204);
    await request(app).put('/api/objetos/abc').expect(400);
    expect(catalogoService.eliminarObjeto).toHaveBeenCalledWith(5);
  });
});
