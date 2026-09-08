import { ReglaNegocioError } from '../exceptions/regla-negocio.error';
import { ValidacionError } from '../exceptions/validacion.error';
import { CatalogoRepository } from '../repositories/catalogo.repository';
import { SolicitudInsert } from '../repositories/solicitud.repository';
import { validarDominioSolicitud } from './solicitud.dominio.validator';

const datos: SolicitudInsert = {
  titulo: 'Tarea',
  descripcion: null,
  observaciones: null,
  tipoTecnicoId: 1,
  tipoServicioId: 10,
  tecnicoId: null,
  objetoId: null,
  estadoId: 1,
  prioridadId: 2,
  resultadoId: null
};

function repo(overrides: Partial<CatalogoRepository> = {}): CatalogoRepository {
  return {
    buscarTipoTecnicoPorId: jest.fn().mockResolvedValue({ id: 1, nombre: 'Impresoras' }),
    buscarTipoServicioPorId: jest
      .fn()
      .mockResolvedValue({ id: 10, nombre: 'Tóner', tipoTecnicoId: 1 }),
    buscarObjetoPorId: jest.fn().mockResolvedValue({ id: 5, nombre: 'HP' }),
    buscarEstadoPorId: jest
      .fn()
      .mockResolvedValue({ id: 1, codigo: 'PENDIENTE', nombre: 'Pendiente' }),
    buscarPrioridadPorId: jest
      .fn()
      .mockResolvedValue({ id: 2, codigo: 'MEDIA', nombre: 'Media' }),
    buscarTecnicoPorId: jest
      .fn()
      .mockResolvedValue({ id: 3, nombre: 'Ana', correo: null, tipoTecnicoId: 1 }),
    buscarResultadoPorId: jest
      .fn()
      .mockResolvedValue({ id: 8, codigo: 'EXITOSA', nombre: 'Exitosa' }),
    ...overrides
  } as unknown as CatalogoRepository;
}

describe('validarDominioSolicitud', () => {
  it('acepta pendiente sin técnico', async () => {
    await expect(validarDominioSolicitud(repo(), datos)).resolves.toBeUndefined();
  });

  it('falla si el servicio, estado, prioridad, técnico o resultado no existen', async () => {
    await expect(
      validarDominioSolicitud(
        repo({ buscarTipoServicioPorId: jest.fn().mockResolvedValue(null) }),
        datos
      )
    ).rejects.toThrow('Tipo de servicio no existe o está inactivo');
    await expect(
      validarDominioSolicitud(
        repo({ buscarEstadoPorId: jest.fn().mockResolvedValue(null) }),
        datos
      )
    ).rejects.toThrow('Estado no existe o está inactivo');
    await expect(
      validarDominioSolicitud(
        repo({ buscarPrioridadPorId: jest.fn().mockResolvedValue(null) }),
        datos
      )
    ).rejects.toThrow('Prioridad no existe o está inactiva');
    await expect(
      validarDominioSolicitud(
        repo({
          buscarEstadoPorId: jest
            .fn()
            .mockResolvedValue({ id: 2, codigo: 'ASIGNADA', nombre: 'Asignada' }),
          buscarTecnicoPorId: jest.fn().mockResolvedValue(null)
        }),
        { ...datos, tecnicoId: 3, estadoId: 2 }
      )
    ).rejects.toThrow('Técnico no existe o está inactivo');
    await expect(
      validarDominioSolicitud(
        repo({
          buscarEstadoPorId: jest
            .fn()
            .mockResolvedValue({ id: 4, codigo: 'CERRADA', nombre: 'Cerrada' }),
          buscarResultadoPorId: jest.fn().mockResolvedValue(null)
        }),
        { ...datos, estadoId: 4, resultadoId: 8, tecnicoId: 3 }
      )
    ).rejects.toThrow('Resultado no existe o está inactivo');
  });

  it('falla si la especialidad no existe', async () => {
    const catalogo = repo({
      buscarTipoTecnicoPorId: jest.fn().mockResolvedValue(null)
    });
    await expect(validarDominioSolicitud(catalogo, datos)).rejects.toThrow(ValidacionError);
  });

  it('falla si el servicio no coincide con la especialidad', async () => {
    const catalogo = repo({
      buscarTipoServicioPorId: jest
        .fn()
        .mockResolvedValue({ id: 10, nombre: 'Apps', tipoTecnicoId: 99 })
    });
    await expect(validarDominioSolicitud(catalogo, datos)).rejects.toThrow(ReglaNegocioError);
  });

  it('exige objeto activo cuando viene objetoId', async () => {
    const catalogo = repo({
      buscarObjetoPorId: jest.fn().mockResolvedValue(null)
    });
    await expect(
      validarDominioSolicitud(catalogo, { ...datos, objetoId: 5 })
    ).rejects.toThrow('Objeto no existe o está inactivo');
  });

  it('no permite técnico en Pendiente', async () => {
    await expect(
      validarDominioSolicitud(repo(), { ...datos, tecnicoId: 3 })
    ).rejects.toThrow('Una solicitud con técnico no puede quedar en Pendiente');
  });

  it('exige Pendiente si no hay técnico', async () => {
    const catalogo = repo({
      buscarEstadoPorId: jest
        .fn()
        .mockResolvedValue({ id: 2, codigo: 'ASIGNADA', nombre: 'Asignada' })
    });
    await expect(
      validarDominioSolicitud(catalogo, { ...datos, estadoId: 2 })
    ).rejects.toThrow('Una solicitud sin técnico debe quedar en Pendiente');
  });

  it('exige resultado al cerrar y lo rechaza si no está cerrada', async () => {
    const cerrada = repo({
      buscarEstadoPorId: jest
        .fn()
        .mockResolvedValue({ id: 4, codigo: 'CERRADA', nombre: 'Cerrada' })
    });
    await expect(
      validarDominioSolicitud(cerrada, { ...datos, estadoId: 4, resultadoId: null, tecnicoId: 3 })
    ).rejects.toThrow('Al cerrar la solicitud debe indicar el resultado');

    await expect(
      validarDominioSolicitud(repo(), { ...datos, resultadoId: 8 })
    ).rejects.toThrow('El resultado solo aplica cuando la solicitud está cerrada');
  });

  it('acepta cerrada con técnico de la misma especialidad y resultado', async () => {
    const catalogo = repo({
      buscarEstadoPorId: jest
        .fn()
        .mockResolvedValue({ id: 4, codigo: 'CERRADA', nombre: 'Cerrada' })
    });
    await expect(
      validarDominioSolicitud(catalogo, {
        ...datos,
        tecnicoId: 3,
        estadoId: 4,
        resultadoId: 8,
        objetoId: 5
      })
    ).resolves.toBeUndefined();
  });

  it('falla si el técnico es de otra especialidad', async () => {
    const catalogo = repo({
      buscarEstadoPorId: jest
        .fn()
        .mockResolvedValue({ id: 2, codigo: 'ASIGNADA', nombre: 'Asignada' }),
      buscarTecnicoPorId: jest
        .fn()
        .mockResolvedValue({ id: 3, nombre: 'Ana', correo: null, tipoTecnicoId: 9 })
    });
    await expect(
      validarDominioSolicitud(catalogo, { ...datos, tecnicoId: 3, estadoId: 2 })
    ).rejects.toThrow('El técnico debe ser de la misma especialidad que el servicio');
  });
});
