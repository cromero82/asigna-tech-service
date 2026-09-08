import {
  CatalogoItemResponse,
  EstadoPrioridadResultadoResponse,
  TecnicoItemResponse,
  TipoServicioItemResponse
} from '../../dtos/response/catalogo.response';
import { AppLogger } from '../../config/logger';
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
}
