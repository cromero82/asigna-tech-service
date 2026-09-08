import { ValidacionError } from '../exceptions/validacion.error';
import {
  validarActualizarSolicitud,
  validarCrearSolicitud
} from './solicitud.request.validator';

const altaValida = {
  titulo: 'Cambio de tóner',
  tipoTecnicoId: 1,
  tipoServicioId: 2
};

describe('validarCrearSolicitud', () => {
  it('acepta el mínimo válido', () => {
    expect(validarCrearSolicitud(altaValida)).toMatchObject({
      titulo: 'Cambio de tóner',
      tipoTecnicoId: 1,
      tipoServicioId: 2,
      tecnicoId: null,
      objetoId: null
    });
  });

  it('rechaza título vacío', () => {
    expect(() => validarCrearSolicitud({ ...altaValida, titulo: '' })).toThrow(
      ValidacionError
    );
  });

  it('rechaza observaciones demasiado largas', () => {
    expect(() =>
      validarCrearSolicitud({ ...altaValida, observaciones: 'x'.repeat(4001) })
    ).toThrow('observaciones no puede superar 4000 caracteres');
  });
});

describe('validarActualizarSolicitud', () => {
  it('exige estado y prioridad', () => {
    expect(() => validarActualizarSolicitud(altaValida)).toThrow('estadoId es obligatorio');
    expect(() =>
      validarActualizarSolicitud({ ...altaValida, estadoId: 1 })
    ).toThrow('prioridadId es obligatorio');
  });

  it('acepta actualización completa', () => {
    const dto = validarActualizarSolicitud({
      ...altaValida,
      estadoId: 1,
      prioridadId: 2,
      resultadoId: null
    });
    expect(dto.estadoId).toBe(1);
    expect(dto.prioridadId).toBe(2);
  });
});
