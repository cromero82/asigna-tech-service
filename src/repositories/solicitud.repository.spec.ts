import { Pool } from 'pg';
import { RecursoNoEncontradoError } from '../exceptions/recurso-no-encontrado.error';
import { SolicitudRepository } from './solicitud.repository';

const row = {
  id: 1,
  titulo: 'Cambio de tóner',
  descripcion: null,
  observaciones: null,
  tipo_tecnico_id: 1,
  tipo_tecnico_nombre: 'Impresoras',
  tipo_servicio_id: 10,
  tipo_servicio_nombre: 'Tóner',
  tecnico_id: null,
  tecnico_nombre: null,
  objeto_id: 5,
  objeto_nombre: 'HP',
  estado_id: 1,
  estado_codigo: 'PENDIENTE',
  estado_nombre: 'Pendiente',
  prioridad_id: 2,
  prioridad_codigo: 'MEDIA',
  prioridad_nombre: 'Media',
  resultado_id: null,
  resultado_codigo: null,
  resultado_nombre: null,
  creado_en: new Date('2026-01-01T00:00:00.000Z'),
  actualizado_en: new Date('2026-01-02T00:00:00.000Z')
};

const datos = {
  titulo: 'Cambio de tóner',
  descripcion: null,
  observaciones: null,
  tipoTecnicoId: 1,
  tipoServicioId: 10,
  tecnicoId: null,
  objetoId: 5,
  estadoId: 1,
  prioridadId: 2,
  resultadoId: null
};

describe('SolicitudRepository', () => {
  it('mapea listado y detalle', async () => {
    const query = jest
      .fn()
      .mockResolvedValueOnce({ rows: [row] })
      .mockResolvedValueOnce({ rows: [row] })
      .mockResolvedValueOnce({ rows: [] });
    const repo = new SolicitudRepository({ query } as unknown as Pool);
    const lista = await repo.listarActivas();
    expect(lista[0].objeto?.nombre).toBe('HP');
    expect(lista[0].tecnico).toBeNull();
    expect(lista[0].creadoEn).toBe('2026-01-01T00:00:00.000Z');
    await expect(repo.buscarActivaPorId(1)).resolves.toMatchObject({ id: 1 });
    await expect(repo.buscarActivaPorId(9)).resolves.toBeNull();
  });

  it('crea, actualiza y borra', async () => {
    const query = jest
      .fn()
      .mockResolvedValueOnce({ rows: [{ id: 12 }] })
      .mockResolvedValueOnce({ rowCount: 1 })
      .mockResolvedValueOnce({ rowCount: 1 });
    const repo = new SolicitudRepository({ query } as unknown as Pool);
    await expect(repo.crear(datos)).resolves.toBe(12);
    await repo.actualizar(12, datos);
    await repo.borrarLogico(12);
  });

  it('lanza 404 si actualizar o borrar no tocan filas', async () => {
    const query = jest.fn().mockResolvedValue({ rowCount: 0 });
    const repo = new SolicitudRepository({ query } as unknown as Pool);
    await expect(repo.actualizar(9, datos)).rejects.toThrow(RecursoNoEncontradoError);
    await expect(repo.borrarLogico(9)).rejects.toThrow(RecursoNoEncontradoError);
  });

  it('mapea técnico, resultado y objeto nulo', async () => {
    const conTecnico = {
      ...row,
      objeto_id: null,
      objeto_nombre: null,
      tecnico_id: 3,
      tecnico_nombre: 'Ana',
      resultado_id: 8,
      resultado_codigo: 'EXITOSA',
      resultado_nombre: 'Exitosa'
    };
    const query = jest.fn().mockResolvedValue({ rows: [conTecnico] });
    const repo = new SolicitudRepository({ query } as unknown as Pool);
    const [item] = await repo.listarActivas();
    expect(item.tecnico).toEqual({ id: 3, nombre: 'Ana' });
    expect(item.resultado?.codigo).toBe('EXITOSA');
    expect(item.objeto).toBeNull();
  });
});
