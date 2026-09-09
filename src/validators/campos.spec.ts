import { ValidacionError } from '../exceptions/validacion.error';
import { asObject, leerId, leerNombre, leerOpcional } from './campos';

describe('campos', () => {
  describe('asObject', () => {
    it('acepta un objeto plano', () => {
      expect(asObject({ a: 1 })).toEqual({ a: 1 });
    });

    it.each([null, 'x', 1, []])('rechaza %p', (valor) => {
      expect(() => asObject(valor)).toThrow(ValidacionError);
    });
  });

  describe('leerNombre', () => {
    it('recorta espacios', () => {
      expect(leerNombre('  Hola  ', 10)).toBe('Hola');
    });

    it('exige valor', () => {
      expect(() => leerNombre('  ', 10)).toThrow('titulo es obligatorio');
    });

    it('limita longitud', () => {
      expect(() => leerNombre('abcd', 3)).toThrow('titulo no puede superar 3 caracteres');
    });
  });

  describe('leerOpcional', () => {
    it('trata vacío, null y undefined como null', () => {
      expect(leerOpcional(undefined, 'x')).toBeNull();
      expect(leerOpcional(null, 'x')).toBeNull();
      expect(leerOpcional('  ', 'x')).toBeNull();
    });

    it('rechaza tipos no string', () => {
      expect(() => leerOpcional(3, 'descripcion')).toThrow('descripcion inválido');
    });

    it('limita longitud cuando hay máximo', () => {
      expect(() => leerOpcional('abcd', 'obs', 3)).toThrow(
        'obs no puede superar 3 caracteres'
      );
    });
  });

  describe('leerId', () => {
    it('devuelve enteros positivos', () => {
      expect(leerId(7, 'id', true)).toBe(7);
    });

    it('permite omitir opcionales', () => {
      expect(leerId(null, 'tecnicoId', false)).toBeNull();
      expect(leerId('', 'tecnicoId', false)).toBeNull();
    });

    it('exige obligatorios', () => {
      expect(() => leerId(undefined, 'tipoTecnicoId', true)).toThrow(
        'tipoTecnicoId es obligatorio'
      );
    });

    it('rechaza no enteros', () => {
      expect(() => leerId(1.5, 'id', true)).toThrow('id inválido');
      expect(() => leerId(0, 'id', true)).toThrow('id inválido');
    });
  });
});
