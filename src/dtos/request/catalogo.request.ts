export interface CrearTipoTecnicoRequest {
  nombre: string;
  descripcion?: string | null;
}

export interface CrearTipoServicioRequest {
  nombre: string;
  descripcion?: string | null;
  tipoTecnicoId: number;
}

export interface CrearTecnicoRequest {
  nombre: string;
  correo?: string | null;
  tipoTecnicoId: number;
}

export interface CrearObjetoRequest {
  nombre: string;
}
