export interface CrearSolicitudRequest {
  titulo: string;
  descripcion?: string | null;
  observaciones?: string | null;
  tipoTecnicoId: number;
  tipoServicioId: number;
  tecnicoId?: number | null;
  objetoId: number;
  estadoId?: number | null;
  prioridadId?: number | null;
  resultadoId?: number | null;
}
