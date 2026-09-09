import {
  CrearObjetoRequest,
  CrearTecnicoRequest,
  CrearTipoServicioRequest,
  CrearTipoTecnicoRequest
} from '../../dtos/request/catalogo.request';
import {
  CatalogoItemResponse,
  EstadoPrioridadResultadoResponse,
  ServicioGrupoResponse,
  TecnicoItemResponse,
  TipoServicioItemResponse
} from '../../dtos/response/catalogo.response';
import { AppLogger } from '../../config/logger';
import { ValidacionError } from '../../exceptions/validacion.error';
import { CatalogoRepository } from '../../repositories/catalogo.repository';
import { CatalogoService } from '../catalogo.service';

export class CatalogoServiceImpl implements CatalogoService {
  constructor(
    private readonly catalogoRepository: CatalogoRepository,
    private readonly logger: AppLogger
  ) {}

  async listarTiposTecnico(): Promise<CatalogoItemResponse[]> {
    this.logger.info('CatalogoService.listarTiposTecnico inicio');
    const lista = await this.catalogoRepository.listarTiposTecnico();
    this.logger.info({ total: lista.length }, 'CatalogoService.listarTiposTecnico fin');
    return lista;
  }

  async listarServicios(): Promise<ServicioGrupoResponse[]> {
    this.logger.info('CatalogoService.listarServicios inicio');
    const lista = await this.catalogoRepository.listarServicios();
    this.logger.info({ total: lista.length }, 'CatalogoService.listarServicios fin');
    return lista;
  }

  async listarTiposServicio(tipoTecnicoId?: number): Promise<TipoServicioItemResponse[]> {
    this.logger.info({ tipoTecnicoId }, 'CatalogoService.listarTiposServicio inicio');
    const lista = await this.catalogoRepository.listarTiposServicio(tipoTecnicoId);
    this.logger.info({ total: lista.length }, 'CatalogoService.listarTiposServicio fin');
    return lista;
  }

  async listarTecnicos(tipoTecnicoId?: number): Promise<TecnicoItemResponse[]> {
    this.logger.info({ tipoTecnicoId }, 'CatalogoService.listarTecnicos inicio');
    const lista = await this.catalogoRepository.listarTecnicos(tipoTecnicoId);
    this.logger.info({ total: lista.length }, 'CatalogoService.listarTecnicos fin');
    return lista;
  }

  async listarObjetos(): Promise<CatalogoItemResponse[]> {
    this.logger.info('CatalogoService.listarObjetos inicio');
    const lista = await this.catalogoRepository.listarObjetos();
    this.logger.info({ total: lista.length }, 'CatalogoService.listarObjetos fin');
    return lista;
  }

  async listarEstados(): Promise<EstadoPrioridadResultadoResponse[]> {
    this.logger.info('CatalogoService.listarEstados inicio');
    const lista = await this.catalogoRepository.listarEstados();
    this.logger.info({ total: lista.length }, 'CatalogoService.listarEstados fin');
    return lista;
  }

  async listarPrioridades(): Promise<EstadoPrioridadResultadoResponse[]> {
    this.logger.info('CatalogoService.listarPrioridades inicio');
    const lista = await this.catalogoRepository.listarPrioridades();
    this.logger.info({ total: lista.length }, 'CatalogoService.listarPrioridades fin');
    return lista;
  }

  async listarResultados(): Promise<EstadoPrioridadResultadoResponse[]> {
    this.logger.info('CatalogoService.listarResultados inicio');
    const lista = await this.catalogoRepository.listarResultados();
    this.logger.info({ total: lista.length }, 'CatalogoService.listarResultados fin');
    return lista;
  }

  async crearTipoTecnico(request: CrearTipoTecnicoRequest): Promise<CatalogoItemResponse> {
    this.logger.info('CatalogoService.crearTipoTecnico inicio');
    const creado = await this.catalogoRepository.crearTipoTecnico(
      leerNombre(request.nombre),
      leerOpcional(request.descripcion)
    );
    this.logger.info({ id: creado.id }, 'CatalogoService.crearTipoTecnico fin');
    return creado;
  }

  async actualizarTipoTecnico(
    id: number,
    request: CrearTipoTecnicoRequest
  ): Promise<CatalogoItemResponse> {
    this.logger.info({ id }, 'CatalogoService.actualizarTipoTecnico inicio');
    const actualizado = await this.catalogoRepository.actualizarTipoTecnico(
      id,
      leerNombre(request.nombre),
      leerOpcional(request.descripcion)
    );
    this.logger.info({ id }, 'CatalogoService.actualizarTipoTecnico fin');
    return actualizado;
  }

  async eliminarTipoTecnico(id: number): Promise<void> {
    this.logger.info({ id }, 'CatalogoService.eliminarTipoTecnico inicio');
    await this.catalogoRepository.borrarLogicoTipoTecnico(id);
    this.logger.info({ id }, 'CatalogoService.eliminarTipoTecnico fin');
  }

  async crearTipoServicio(request: CrearTipoServicioRequest): Promise<TipoServicioItemResponse> {
    this.logger.info('CatalogoService.crearTipoServicio inicio');
    const creado = await this.catalogoRepository.crearTipoServicio(
      leerNombre(request.nombre),
      leerOpcional(request.descripcion),
      leerId(request.tipoTecnicoId, 'tipoTecnicoId')
    );
    this.logger.info({ id: creado.id }, 'CatalogoService.crearTipoServicio fin');
    return creado;
  }

  async actualizarTipoServicio(
    id: number,
    request: CrearTipoServicioRequest
  ): Promise<TipoServicioItemResponse> {
    this.logger.info({ id }, 'CatalogoService.actualizarTipoServicio inicio');
    const actualizado = await this.catalogoRepository.actualizarTipoServicio(
      id,
      leerNombre(request.nombre),
      leerOpcional(request.descripcion),
      leerId(request.tipoTecnicoId, 'tipoTecnicoId')
    );
    this.logger.info({ id }, 'CatalogoService.actualizarTipoServicio fin');
    return actualizado;
  }

  async eliminarTipoServicio(id: number): Promise<void> {
    this.logger.info({ id }, 'CatalogoService.eliminarTipoServicio inicio');
    await this.catalogoRepository.borrarLogicoTipoServicio(id);
    this.logger.info({ id }, 'CatalogoService.eliminarTipoServicio fin');
  }

  async crearTecnico(request: CrearTecnicoRequest): Promise<TecnicoItemResponse> {
    this.logger.info('CatalogoService.crearTecnico inicio');
    const creado = await this.catalogoRepository.crearTecnico(
      leerNombre(request.nombre),
      leerOpcional(request.correo),
      leerId(request.tipoTecnicoId, 'tipoTecnicoId')
    );
    this.logger.info({ id: creado.id }, 'CatalogoService.crearTecnico fin');
    return creado;
  }

  async actualizarTecnico(
    id: number,
    request: CrearTecnicoRequest
  ): Promise<TecnicoItemResponse> {
    this.logger.info({ id }, 'CatalogoService.actualizarTecnico inicio');
    const actualizado = await this.catalogoRepository.actualizarTecnico(
      id,
      leerNombre(request.nombre),
      leerOpcional(request.correo),
      leerId(request.tipoTecnicoId, 'tipoTecnicoId')
    );
    this.logger.info({ id }, 'CatalogoService.actualizarTecnico fin');
    return actualizado;
  }

  async eliminarTecnico(id: number): Promise<void> {
    this.logger.info({ id }, 'CatalogoService.eliminarTecnico inicio');
    await this.catalogoRepository.borrarLogicoTecnico(id);
    this.logger.info({ id }, 'CatalogoService.eliminarTecnico fin');
  }

  async crearObjeto(request: CrearObjetoRequest): Promise<CatalogoItemResponse> {
    this.logger.info('CatalogoService.crearObjeto inicio');
    const creado = await this.catalogoRepository.crearObjeto(leerNombre(request.nombre));
    this.logger.info({ id: creado.id }, 'CatalogoService.crearObjeto fin');
    return creado;
  }

  async actualizarObjeto(id: number, request: CrearObjetoRequest): Promise<CatalogoItemResponse> {
    this.logger.info({ id }, 'CatalogoService.actualizarObjeto inicio');
    const actualizado = await this.catalogoRepository.actualizarObjeto(
      id,
      leerNombre(request.nombre)
    );
    this.logger.info({ id }, 'CatalogoService.actualizarObjeto fin');
    return actualizado;
  }

  async eliminarObjeto(id: number): Promise<void> {
    this.logger.info({ id }, 'CatalogoService.eliminarObjeto inicio');
    await this.catalogoRepository.borrarLogicoObjeto(id);
    this.logger.info({ id }, 'CatalogoService.eliminarObjeto fin');
  }
}

function leerNombre(valor: unknown): string {
  if (typeof valor !== 'string' || !valor.trim()) {
    throw new ValidacionError('nombre es obligatorio');
  }
  return valor.trim();
}

function leerOpcional(valor: unknown): string | null {
  if (valor === undefined || valor === null) {
    return null;
  }
  if (typeof valor !== 'string') {
    throw new ValidacionError('valor inválido');
  }
  const texto = valor.trim();
  return texto === '' ? null : texto;
}

function leerId(valor: unknown, campo: string): number {
  const id = Number(valor);
  if (!Number.isInteger(id) || id <= 0) {
    throw new ValidacionError(`${campo} inválido`);
  }
  return id;
}
