import {
  CrearObjetoRequest,
  CrearTecnicoRequest,
  CrearTipoServicioRequest,
  CrearTipoTecnicoRequest
} from '../dtos/request/catalogo.request';
import {
  CatalogoItemResponse,
  EstadoPrioridadResultadoResponse,
  ServicioGrupoResponse,
  TecnicoItemResponse,
  TipoServicioItemResponse
} from '../dtos/response/catalogo.response';

export interface CatalogoService {
  listarTiposTecnico(): Promise<CatalogoItemResponse[]>;
  listarServicios(): Promise<ServicioGrupoResponse[]>;
  listarTiposServicio(tipoTecnicoId?: number): Promise<TipoServicioItemResponse[]>;
  listarTecnicos(tipoTecnicoId?: number): Promise<TecnicoItemResponse[]>;
  listarObjetos(): Promise<CatalogoItemResponse[]>;
  listarEstados(): Promise<EstadoPrioridadResultadoResponse[]>;
  listarPrioridades(): Promise<EstadoPrioridadResultadoResponse[]>;
  listarResultados(): Promise<EstadoPrioridadResultadoResponse[]>;
  crearTipoTecnico(request: CrearTipoTecnicoRequest): Promise<CatalogoItemResponse>;
  actualizarTipoTecnico(
    id: number,
    request: CrearTipoTecnicoRequest
  ): Promise<CatalogoItemResponse>;
  eliminarTipoTecnico(id: number): Promise<void>;
  crearTipoServicio(request: CrearTipoServicioRequest): Promise<TipoServicioItemResponse>;
  actualizarTipoServicio(
    id: number,
    request: CrearTipoServicioRequest
  ): Promise<TipoServicioItemResponse>;
  eliminarTipoServicio(id: number): Promise<void>;
  crearTecnico(request: CrearTecnicoRequest): Promise<TecnicoItemResponse>;
  actualizarTecnico(id: number, request: CrearTecnicoRequest): Promise<TecnicoItemResponse>;
  eliminarTecnico(id: number): Promise<void>;
  crearObjeto(request: CrearObjetoRequest): Promise<CatalogoItemResponse>;
  actualizarObjeto(id: number, request: CrearObjetoRequest): Promise<CatalogoItemResponse>;
  eliminarObjeto(id: number): Promise<void>;
}
