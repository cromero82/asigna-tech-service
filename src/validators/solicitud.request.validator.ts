import { ActualizarSolicitudRequest } from '../dtos/request/actualizar-solicitud.request';
import { CrearSolicitudRequest } from '../dtos/request/crear-solicitud.request';
import { asObject, leerId, leerNombre, leerOpcional } from './campos';

const TITULO_MAX = 160;
const TEXTO_MAX = 4000;

export function validarCrearSolicitud(body: unknown): CrearSolicitudRequest {
  const o = asObject(body);
  return {
    titulo: leerNombre(o.titulo, TITULO_MAX),
    descripcion: leerOpcional(o.descripcion, 'descripcion', TEXTO_MAX),
    observaciones: leerOpcional(o.observaciones, 'observaciones', TEXTO_MAX),
    tipoTecnicoId: leerId(o.tipoTecnicoId, 'tipoTecnicoId', true),
    tipoServicioId: leerId(o.tipoServicioId, 'tipoServicioId', true),
    tecnicoId: leerId(o.tecnicoId, 'tecnicoId', false),
    objetoId: leerId(o.objetoId, 'objetoId', false),
    estadoId: leerId(o.estadoId, 'estadoId', false),
    prioridadId: leerId(o.prioridadId, 'prioridadId', false),
    resultadoId: leerId(o.resultadoId, 'resultadoId', false)
  };
}

export function validarActualizarSolicitud(body: unknown): ActualizarSolicitudRequest {
  const o = asObject(body);
  return {
    titulo: leerNombre(o.titulo, TITULO_MAX),
    descripcion: leerOpcional(o.descripcion, 'descripcion', TEXTO_MAX),
    observaciones: leerOpcional(o.observaciones, 'observaciones', TEXTO_MAX),
    tipoTecnicoId: leerId(o.tipoTecnicoId, 'tipoTecnicoId', true),
    tipoServicioId: leerId(o.tipoServicioId, 'tipoServicioId', true),
    tecnicoId: leerId(o.tecnicoId, 'tecnicoId', false),
    objetoId: leerId(o.objetoId, 'objetoId', false),
    estadoId: leerId(o.estadoId, 'estadoId', true),
    prioridadId: leerId(o.prioridadId, 'prioridadId', true),
    resultadoId: leerId(o.resultadoId, 'resultadoId', false)
  };
}
