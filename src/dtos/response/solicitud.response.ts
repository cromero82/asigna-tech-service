export interface CatalogoRefResponse {
  id: number;
  nombre: string;
  codigo?: string;
}

export interface SolicitudResponse {
  id: number;
  titulo: string;
  descripcion: string | null;
  observaciones: string | null;
  tipoTecnico: CatalogoRefResponse;
  tipoServicio: CatalogoRefResponse;
  tecnico: CatalogoRefResponse | null;
  objeto: CatalogoRefResponse;
  estado: CatalogoRefResponse;
  prioridad: CatalogoRefResponse;
  resultado: CatalogoRefResponse | null;
  creadoEn: string;
  actualizadoEn: string;
}
