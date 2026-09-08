import { ActualizarSolicitudRequest } from '../dtos/request/actualizar-solicitud.request';
import { CrearSolicitudRequest } from '../dtos/request/crear-solicitud.request';
import { SolicitudResponse } from '../dtos/response/solicitud.response';

export interface SolicitudService {
  listar(): Promise<SolicitudResponse[]>;
  obtenerPorId(id: number): Promise<SolicitudResponse>;
  crear(request: CrearSolicitudRequest): Promise<SolicitudResponse>;
  actualizar(id: number, request: ActualizarSolicitudRequest): Promise<SolicitudResponse>;
  eliminar(id: number): Promise<void>;
}
