import { ActualizarSolicitudRequest } from '../../dtos/request/actualizar-solicitud.request';
import { CrearSolicitudRequest } from '../../dtos/request/crear-solicitud.request';
import { SolicitudResponse } from '../../dtos/response/solicitud.response';
import { AppLogger } from '../../config/logger';
import { RecursoNoEncontradoError } from '../../exceptions/recurso-no-encontrado.error';
import { CatalogoRepository } from '../../repositories/catalogo.repository';
import { SolicitudInsert, SolicitudRepository } from '../../repositories/solicitud.repository';
import { SolicitudService } from '../solicitud.service';

export class SolicitudServiceImpl implements SolicitudService {
  constructor(
    private readonly solicitudRepository: SolicitudRepository,
    private readonly catalogoRepository: CatalogoRepository,
    private readonly logger: AppLogger
  ) {}

  async listar(): Promise<SolicitudResponse[]> {
    this.logger.info('SolicitudService.listar inicio');
    const lista = await this.solicitudRepository.listarActivas();
    this.logger.info({ total: lista.length }, 'SolicitudService.listar fin');
    return lista;
  }

  async obtenerPorId(id: number): Promise<SolicitudResponse> {
    this.logger.info({ id }, 'SolicitudService.obtenerPorId inicio');
    const solicitud = await this.solicitudRepository.buscarActivaPorId(id);
    if (!solicitud) {
      throw new RecursoNoEncontradoError('Solicitud', id);
    }
    this.logger.info({ id }, 'SolicitudService.obtenerPorId fin');
    return solicitud;
  }

  async crear(request: CrearSolicitudRequest): Promise<SolicitudResponse> {
    this.logger.info({ titulo: request.titulo }, 'SolicitudService.crear inicio');
    const datos = await this.resolverAlta(request);
    const id = await this.solicitudRepository.crear(datos);
    const creada = await this.obtenerPorId(id);
    this.logger.info({ id }, 'SolicitudService.crear fin');
    return creada;
  }

  async actualizar(
    id: number,
    request: ActualizarSolicitudRequest
  ): Promise<SolicitudResponse> {
    this.logger.info({ id }, 'SolicitudService.actualizar inicio');
    await this.solicitudRepository.actualizar(id, this.mapearActualizacion(request));
    const actualizada = await this.obtenerPorId(id);
    this.logger.info({ id }, 'SolicitudService.actualizar fin');
    return actualizada;
  }

  async eliminar(id: number): Promise<void> {
    this.logger.info({ id }, 'SolicitudService.eliminar inicio');
    await this.solicitudRepository.borrarLogico(id);
    this.logger.info({ id }, 'SolicitudService.eliminar fin');
  }

  private async resolverAlta(request: CrearSolicitudRequest): Promise<SolicitudInsert> {
    const tecnicoId = request.tecnicoId ?? null;
    const estadoId =
      request.estadoId ??
      (await this.catalogoRepository.buscarEstadoIdPorCodigo(
        tecnicoId ? 'ASIGNADA' : 'PENDIENTE'
      ));
    const prioridadId =
      request.prioridadId ??
      (await this.catalogoRepository.buscarPrioridadIdPorCodigo('MEDIA'));
    return {
      titulo: request.titulo,
      descripcion: request.descripcion ?? null,
      observaciones: request.observaciones ?? null,
      tipoTecnicoId: request.tipoTecnicoId,
      tipoServicioId: request.tipoServicioId,
      tecnicoId,
      objetoId: request.objetoId ?? null,
      estadoId,
      prioridadId,
      resultadoId: request.resultadoId ?? null
    };
  }

  private mapearActualizacion(request: ActualizarSolicitudRequest): SolicitudInsert {
    return {
      titulo: request.titulo,
      descripcion: request.descripcion ?? null,
      observaciones: request.observaciones ?? null,
      tipoTecnicoId: request.tipoTecnicoId,
      tipoServicioId: request.tipoServicioId,
      tecnicoId: request.tecnicoId ?? null,
      objetoId: request.objetoId ?? null,
      estadoId: request.estadoId,
      prioridadId: request.prioridadId,
      resultadoId: request.resultadoId ?? null
    };
  }
}
