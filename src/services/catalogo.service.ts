import {
  CatalogoItemResponse,
  EstadoPrioridadResultadoResponse,
  TecnicoItemResponse,
  TipoServicioItemResponse
} from '../dtos/response/catalogo.response';

export interface CatalogoService {
  listarTiposTecnico(): Promise<CatalogoItemResponse[]>;
  listarTiposServicio(tipoTecnicoId?: number): Promise<TipoServicioItemResponse[]>;
  listarTecnicos(tipoTecnicoId?: number): Promise<TecnicoItemResponse[]>;
  listarObjetos(): Promise<CatalogoItemResponse[]>;
  listarEstados(): Promise<EstadoPrioridadResultadoResponse[]>;
  listarPrioridades(): Promise<EstadoPrioridadResultadoResponse[]>;
  listarResultados(): Promise<EstadoPrioridadResultadoResponse[]>;
}
