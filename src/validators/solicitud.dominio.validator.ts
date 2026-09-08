import { ReglaNegocioError } from '../exceptions/regla-negocio.error';
import { ValidacionError } from '../exceptions/validacion.error';
import { CatalogoRepository } from '../repositories/catalogo.repository';
import { SolicitudInsert } from '../repositories/solicitud.repository';

export async function validarDominioSolicitud(
  repo: CatalogoRepository,
  datos: SolicitudInsert
): Promise<void> {
  const especialidad = await repo.buscarTipoTecnicoPorId(datos.tipoTecnicoId);
  if (!especialidad) {
    throw new ValidacionError('Especialidad no existe o está inactiva');
  }

  const servicio = await repo.buscarTipoServicioPorId(datos.tipoServicioId);
  if (!servicio) {
    throw new ValidacionError('Tipo de servicio no existe o está inactivo');
  }
  if (servicio.tipoTecnicoId !== datos.tipoTecnicoId) {
    throw new ReglaNegocioError('El tipo de servicio no corresponde a la especialidad');
  }

  if (datos.objetoId !== null) {
    const objeto = await repo.buscarObjetoPorId(datos.objetoId);
    if (!objeto) {
      throw new ValidacionError('Objeto no existe o está inactivo');
    }
  }

  const estado = await repo.buscarEstadoPorId(datos.estadoId);
  if (!estado) {
    throw new ValidacionError('Estado no existe o está inactivo');
  }

  const prioridad = await repo.buscarPrioridadPorId(datos.prioridadId);
  if (!prioridad) {
    throw new ValidacionError('Prioridad no existe o está inactiva');
  }

  if (datos.tecnicoId !== null) {
    const tecnico = await repo.buscarTecnicoPorId(datos.tecnicoId);
    if (!tecnico) {
      throw new ValidacionError('Técnico no existe o está inactivo');
    }
    if (tecnico.tipoTecnicoId !== datos.tipoTecnicoId) {
      throw new ReglaNegocioError(
        'El técnico debe ser de la misma especialidad que el servicio'
      );
    }
    if (estado.codigo === 'PENDIENTE') {
      throw new ReglaNegocioError('Una solicitud con técnico no puede quedar en Pendiente');
    }
  } else if (estado.codigo !== 'PENDIENTE') {
    throw new ReglaNegocioError('Una solicitud sin técnico debe quedar en Pendiente');
  }

  if (estado.codigo === 'CERRADA') {
    if (datos.resultadoId === null) {
      throw new ReglaNegocioError('Al cerrar la solicitud debe indicar el resultado');
    }
    const resultado = await repo.buscarResultadoPorId(datos.resultadoId);
    if (!resultado) {
      throw new ValidacionError('Resultado no existe o está inactivo');
    }
  } else if (datos.resultadoId !== null) {
    throw new ReglaNegocioError('El resultado solo aplica cuando la solicitud está cerrada');
  }
}
