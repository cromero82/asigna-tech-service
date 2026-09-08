import { Pool } from 'pg';
import { RecursoNoEncontradoError } from '../exceptions/recurso-no-encontrado.error';
import { CatalogoRepository } from './catalogo.repository';

describe('CatalogoRepository', () => {
  it('agrupa servicios por especialidad', async () => {
    const query = jest.fn().mockResolvedValue({
      rows: [
        {
          especialidadId: 1,
          especialidadNombre: 'Impresoras',
          tipoServicioId: 10,
          tipoServicioNombre: 'Tóner'
        },
        {
          especialidadId: 1,
          especialidadNombre: 'Impresoras',
          tipoServicioId: 11,
          tipoServicioNombre: 'Instalación'
        },
        {
          especialidadId: 2,
          especialidadNombre: 'Redes',
          tipoServicioId: 20,
          tipoServicioNombre: 'Cableado'
        }
      ]
    });
    const repo = new CatalogoRepository({ query } as unknown as Pool);
    const grupos = await repo.listarServicios();
    expect(grupos).toHaveLength(2);
    expect(grupos[0].tiposServicio).toHaveLength(2);
  });

  it('lista con y sin filtro de especialidad', async () => {
    const query = jest.fn().mockResolvedValue({ rows: [] });
    const repo = new CatalogoRepository({ query } as unknown as Pool);
    await repo.listarTiposTecnico();
    await repo.listarTiposServicio();
    await repo.listarTiposServicio(1);
    await repo.listarTecnicos();
    await repo.listarTecnicos(2);
    await repo.listarObjetos();
    await repo.listarEstados();
    await repo.listarPrioridades();
    await repo.listarResultados();
    expect(query).toHaveBeenCalledTimes(9);
  });

  it('busca por id y código, incluyendo nulos', async () => {
    const query = jest
      .fn()
      .mockResolvedValueOnce({ rows: [{ id: 1 }] })
      .mockResolvedValueOnce({ rows: [{ id: 2 }] })
      .mockResolvedValueOnce({ rows: [{ id: 1, nombre: 'Impresoras' }] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });
    const repo = new CatalogoRepository({ query } as unknown as Pool);
    await expect(repo.buscarEstadoIdPorCodigo('PENDIENTE')).resolves.toBe(1);
    await expect(repo.buscarPrioridadIdPorCodigo('MEDIA')).resolves.toBe(2);
    await expect(repo.buscarTipoTecnicoPorId(1)).resolves.toEqual({
      id: 1,
      nombre: 'Impresoras'
    });
    await expect(repo.buscarTipoServicioPorId(9)).resolves.toBeNull();
    await expect(repo.buscarTecnicoPorId(9)).resolves.toBeNull();
    await expect(repo.buscarObjetoPorId(9)).resolves.toBeNull();
    await expect(repo.buscarEstadoPorId(9)).resolves.toBeNull();
    await expect(repo.buscarPrioridadPorId(9)).resolves.toBeNull();
    await expect(repo.buscarResultadoPorId(9)).resolves.toBeNull();
  });

  it('crea, actualiza y borra catálogos', async () => {
    const query = jest
      .fn()
      .mockResolvedValueOnce({ rows: [{ id: 1, nombre: 'Redes' }] })
      .mockResolvedValueOnce({ rows: [{ id: 1, nombre: 'Redes' }] })
      .mockResolvedValueOnce({ rowCount: 1 })
      .mockResolvedValueOnce({ rows: [{ id: 2, nombre: 'Cableado', tipoTecnicoId: 1 }] })
      .mockResolvedValueOnce({ rows: [{ id: 2, nombre: 'Cableado', tipoTecnicoId: 1 }] })
      .mockResolvedValueOnce({ rowCount: 1 })
      .mockResolvedValueOnce({
        rows: [{ id: 3, nombre: 'Ana', correo: null, tipoTecnicoId: 1 }]
      })
      .mockResolvedValueOnce({
        rows: [{ id: 3, nombre: 'Ana', correo: null, tipoTecnicoId: 1 }]
      })
      .mockResolvedValueOnce({ rowCount: 1 })
      .mockResolvedValueOnce({ rows: [{ id: 4, nombre: 'Switch' }] })
      .mockResolvedValueOnce({ rows: [{ id: 4, nombre: 'Switch' }] })
      .mockResolvedValueOnce({ rowCount: 1 });
    const repo = new CatalogoRepository({ query } as unknown as Pool);
    await repo.crearTipoTecnico('Redes', null);
    await repo.actualizarTipoTecnico(1, 'Redes', null);
    await repo.borrarLogicoTipoTecnico(1);
    await repo.crearTipoServicio('Cableado', null, 1);
    await repo.actualizarTipoServicio(2, 'Cableado', null, 1);
    await repo.borrarLogicoTipoServicio(2);
    await repo.crearTecnico('Ana', null, 1);
    await repo.actualizarTecnico(3, 'Ana', null, 1);
    await repo.borrarLogicoTecnico(3);
    await repo.crearObjeto('Switch');
    await repo.actualizarObjeto(4, 'Switch');
    await repo.borrarLogicoObjeto(4);
  });

  it('lanza 404 al actualizar o borrar un registro inactivo', async () => {
    const query = jest.fn().mockResolvedValue({ rows: [], rowCount: 0 });
    const repo = new CatalogoRepository({ query } as unknown as Pool);
    await expect(repo.actualizarTipoTecnico(9, 'X', null)).rejects.toThrow(
      RecursoNoEncontradoError
    );
    await expect(repo.actualizarTipoServicio(9, 'X', null, 1)).rejects.toThrow(
      RecursoNoEncontradoError
    );
    await expect(repo.actualizarTecnico(9, 'X', null, 1)).rejects.toThrow(
      RecursoNoEncontradoError
    );
    await expect(repo.actualizarObjeto(9, 'X')).rejects.toThrow(RecursoNoEncontradoError);
    await expect(repo.borrarLogicoObjeto(9)).rejects.toThrow(RecursoNoEncontradoError);
  });
});
