import { ValidacionError } from '../../exceptions/validacion.error';
import { CatalogoRepository } from '../../repositories/catalogo.repository';
import { loggerSilencioso } from '../../test/helpers';
import { CatalogoServiceImpl } from './catalogo.service.impl';

function repo(overrides: Partial<CatalogoRepository> = {}): CatalogoRepository {
  return {
    listarTiposTecnico: jest.fn().mockResolvedValue([{ id: 1, nombre: 'Impresoras' }]),
    listarServicios: jest.fn().mockResolvedValue([]),
    listarTiposServicio: jest.fn().mockResolvedValue([]),
    listarTecnicos: jest.fn().mockResolvedValue([]),
    listarObjetos: jest.fn().mockResolvedValue([]),
    listarEstados: jest.fn().mockResolvedValue([]),
    listarPrioridades: jest.fn().mockResolvedValue([]),
    listarResultados: jest.fn().mockResolvedValue([]),
    crearTipoTecnico: jest.fn().mockResolvedValue({ id: 9, nombre: 'Redes' }),
    actualizarTipoTecnico: jest.fn().mockResolvedValue({ id: 9, nombre: 'Redes' }),
    borrarLogicoTipoTecnico: jest.fn().mockResolvedValue(undefined),
    crearTipoServicio: jest
      .fn()
      .mockResolvedValue({ id: 3, nombre: 'Cableado', tipoTecnicoId: 1 }),
    actualizarTipoServicio: jest
      .fn()
      .mockResolvedValue({ id: 3, nombre: 'Cableado', tipoTecnicoId: 1 }),
    borrarLogicoTipoServicio: jest.fn().mockResolvedValue(undefined),
    crearTecnico: jest
      .fn()
      .mockResolvedValue({ id: 4, nombre: 'Ana', correo: null, tipoTecnicoId: 1 }),
    actualizarTecnico: jest
      .fn()
      .mockResolvedValue({ id: 4, nombre: 'Ana', correo: null, tipoTecnicoId: 1 }),
    borrarLogicoTecnico: jest.fn().mockResolvedValue(undefined),
    crearObjeto: jest.fn().mockResolvedValue({ id: 5, nombre: 'Switch' }),
    actualizarObjeto: jest.fn().mockResolvedValue({ id: 5, nombre: 'Switch' }),
    borrarLogicoObjeto: jest.fn().mockResolvedValue(undefined),
    ...overrides
  } as unknown as CatalogoRepository;
}

describe('CatalogoServiceImpl', () => {
  it('delega listados', async () => {
    const catalogo = repo();
    const service = new CatalogoServiceImpl(catalogo, loggerSilencioso);
    await service.listarTiposTecnico();
    await service.listarServicios();
    await service.listarTiposServicio(1);
    await service.listarTecnicos();
    await service.listarObjetos();
    await service.listarEstados();
    await service.listarPrioridades();
    await service.listarResultados();
    expect(catalogo.listarTiposTecnico).toHaveBeenCalled();
    expect(catalogo.listarTiposServicio).toHaveBeenCalledWith(1);
  });

  it('valida nombre al crear especialidad y objeto', async () => {
    const service = new CatalogoServiceImpl(repo(), loggerSilencioso);
    await expect(service.crearTipoTecnico({ nombre: '  ' })).rejects.toThrow(ValidacionError);
    await expect(service.crearTecnico({ nombre: 'Ana', tipoTecnicoId: 1, correo: 1 as unknown as string })).rejects.toThrow(
      'valor inválido'
    );
    await expect(service.crearObjeto({ nombre: 'Switch' })).resolves.toEqual({
      id: 5,
      nombre: 'Switch'
    });
  });

  it('crea y actualiza técnico y servicio con tipoTecnicoId', async () => {
    const catalogo = repo();
    const service = new CatalogoServiceImpl(catalogo, loggerSilencioso);
    await service.crearTecnico({ nombre: 'Ana', tipoTecnicoId: 1, correo: '' });
    await service.actualizarTecnico(4, { nombre: 'Ana', tipoTecnicoId: 1 });
    await service.crearTipoServicio({ nombre: 'Cableado', tipoTecnicoId: 1 });
    await service.actualizarTipoServicio(3, { nombre: 'Cableado', tipoTecnicoId: 1 });
    await service.actualizarTipoTecnico(9, { nombre: 'Redes', descripcion: 'x' });
    await service.actualizarObjeto(5, { nombre: 'Switch' });
    await service.eliminarTipoTecnico(9);
    await service.eliminarTipoServicio(3);
    await service.eliminarTecnico(4);
    await service.eliminarObjeto(5);
    expect(catalogo.borrarLogicoObjeto).toHaveBeenCalledWith(5);
  });

  it('rechaza tipoTecnicoId inválido', async () => {
    const service = new CatalogoServiceImpl(repo(), loggerSilencioso);
    await expect(
      service.crearTipoServicio({ nombre: 'X', tipoTecnicoId: 0 })
    ).rejects.toThrow('tipoTecnicoId inválido');
  });
});
