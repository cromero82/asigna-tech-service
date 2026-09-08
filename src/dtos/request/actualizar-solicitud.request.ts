export interface ActualizarSolicitudRequest {
  titulo: string;
  descripcion?: string | null;
  observaciones?: string | null;
  tipoTecnicoId: number;
  tipoServicioId: number;
  tecnicoId?: number | null;
  objetoId?: number | null;
  estadoId: number;
  prioridadId: number;
  resultadoId?: number | null;
}
