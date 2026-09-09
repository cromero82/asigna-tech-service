import { RecursoNoEncontradoError } from '../../exceptions/recurso-no-encontrado.error';
import { CatalogoRepository } from '../../repositories/catalogo.repository';
import { SolicitudRepository } from '../../repositories/solicitud.repository';
import { loggerSilencioso } from '../../test/helpers';
import { SolicitudServiceImpl } from './solicitud.service.impl';

const respuesta = {
  id: 1,
  titulo: 'Cambio de tóner',
  descripcion: null,
  observaciones: null,
  tipoTecnico: { id: 1, nombre: 'Impresoras' },
  tipoServicio: { id: 10, nombre: 'Tóner' },
  tecnico: null,
  objeto: null,
  estado: { id: 1, nombre: 'Pendiente', codigo: 'PENDIENTE' },
  prioridad: { id: 2, nombre: 'Media', codigo: 'MEDIA' },
  resultado: null,
  creadoEn: '2026-01-01T00:00:00.000Z',
  actualizadoEn: '2026-01-01T00:00:00.000Z'
};

function repos(overrides: {
  solicitud?: Partial<SolicitudRepository>;
  catalogo?: Partial<CatalogoRepository>;
} = {}) {
  const solicitudRepository = {
    listarActivas: jest.fn().mockResolvedValue([respuesta]),
    buscarActivaPorId: jest.fn().mockResolvedValue(respuesta),
    crear: jest.fn().mockResolvedValue(1),
    actualizar: jest.fn().mockResolvedValue(undefined),
    borrarLogico: jest.fn().mockResolvedValue(undefined),
    ...overrides.solicitud
  } as unknown as SolicitudRepository;

  const catalogoRepository = {
    buscarEstadoIdPorCodigo: jest.fn().mockImplementation(async (codigo: string) =>
      codigo === 'PENDIENTE' ? 1 : 2
    ),
    buscarPrioridadIdPorCodigo: jest.fn().mockResolvedValue(2),
    buscarTipoTecnicoPorId: jest.fn().mockResolvedValue({ id: 1, nombre: 'Impresoras' }),
    buscarTipoServicioPorId: jest
      .fn()
      .mockResolvedValue({ id: 10, nombre: 'Tóner', tipoTecnicoId: 1 }),
    buscarObjetoPorId: jest.fn().mockResolvedValue(null),
    buscarEstadoPorId: jest
      .fn()
      .mockResolvedValue({ id: 1, codigo: 'PENDIENTE', nombre: 'Pendiente' }),
    buscarPrioridadPorId: jest
      .fn()
      .mockResolvedValue({ id: 2, codigo: 'MEDIA', nombre: 'Media' }),
    buscarTecnicoPorId: jest.fn().mockResolvedValue(null),
    buscarResultadoPorId: jest.fn().mockResolvedValue(null),
    ...overrides.catalogo
  } as unknown as CatalogoRepository;

  return { solicitudRepository, catalogoRepository };
}

describe('SolicitudServiceImpl', () => {
  it('lista y obtiene', async () => {
    const { solicitudRepository, catalogoRepository } = repos();
    const service = new SolicitudServiceImpl(
      solicitudRepository,
      catalogoRepository,
      loggerSilencioso
    );
    await expect(service.listar()).resolves.toEqual([respuesta]);
    await expect(service.obtenerPorId(1)).resolves.toEqual(respuesta);
  });

  it('lanza 404 si no existe', async () => {
    const { solicitudRepository, catalogoRepository } = repos({
      solicitud: { buscarActivaPorId: jest.fn().mockResolvedValue(null) }
    });
    const service = new SolicitudServiceImpl(
      solicitudRepository,
      catalogoRepository,
      loggerSilencioso
    );
    await expect(service.obtenerPorId(99)).rejects.toThrow(RecursoNoEncontradoError);
  });

  it('crea con defaults Pendiente y Media', async () => {
    const { solicitudRepository, catalogoRepository } = repos();
    const service = new SolicitudServiceImpl(
      solicitudRepository,
      catalogoRepository,
      loggerSilencioso
    );
    await service.crear({
      titulo: 'Cambio de tóner',
      tipoTecnicoId: 1,
      tipoServicioId: 10
    });
    expect(catalogoRepository.buscarEstadoIdPorCodigo).toHaveBeenCalledWith('PENDIENTE');
    expect(catalogoRepository.buscarPrioridadIdPorCodigo).toHaveBeenCalledWith('MEDIA');
    expect(solicitudRepository.crear).toHaveBeenCalled();
  });

  it('crea como Asignada si viene técnico', async () => {
    const { solicitudRepository, catalogoRepository } = repos({
      catalogo: {
        buscarEstadoPorId: jest
          .fn()
          .mockResolvedValue({ id: 2, codigo: 'ASIGNADA', nombre: 'Asignada' }),
        buscarTecnicoPorId: jest
          .fn()
          .mockResolvedValue({ id: 3, nombre: 'Ana', correo: null, tipoTecnicoId: 1 })
      }
    });
    const service = new SolicitudServiceImpl(
      solicitudRepository,
      catalogoRepository,
      loggerSilencioso
    );
    await service.crear({
      titulo: 'Cambio de tóner',
      tipoTecnicoId: 1,
      tipoServicioId: 10,
      tecnicoId: 3
    });
    expect(catalogoRepository.buscarEstadoIdPorCodigo).toHaveBeenCalledWith('ASIGNADA');
  });

  it('actualiza y elimina', async () => {
    const { solicitudRepository, catalogoRepository } = repos();
    const service = new SolicitudServiceImpl(
      solicitudRepository,
      catalogoRepository,
      loggerSilencioso
    );
    await service.actualizar(1, {
      titulo: 'Cambio de tóner',
      tipoTecnicoId: 1,
      tipoServicioId: 10,
      estadoId: 1,
      prioridadId: 2
    });
    expect(solicitudRepository.actualizar).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ titulo: 'Cambio de tóner', estadoId: 1 })
    );
    await service.eliminar(1);
    expect(solicitudRepository.borrarLogico).toHaveBeenCalledWith(1);
  });
});
