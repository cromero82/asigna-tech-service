export interface CatalogoItemResponse {
  id: number;
  nombre: string;
}

export interface EstadoPrioridadResultadoResponse {
  id: number;
  codigo: string;
  nombre: string;
}

export interface TipoServicioItemResponse {
  id: number;
  nombre: string;
  tipoTecnicoId: number;
}

export interface TecnicoItemResponse {
  id: number;
  nombre: string;
  correo: string | null;
  tipoTecnicoId: number;
}
