import { ValidacionError } from '../exceptions/validacion.error';

export function asObject(body: unknown): Record<string, unknown> {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    throw new ValidacionError('Cuerpo de la petición inválido');
  }
  return body as Record<string, unknown>;
}

export function leerNombre(valor: unknown, max: number): string {
  if (typeof valor !== 'string' || !valor.trim()) {
    throw new ValidacionError('titulo es obligatorio');
  }
  const texto = valor.trim();
  if (texto.length > max) {
    throw new ValidacionError(`titulo no puede superar ${max} caracteres`);
  }
  return texto;
}

export function leerOpcional(valor: unknown, campo: string, max?: number): string | null {
  if (valor === undefined || valor === null) {
    return null;
  }
  if (typeof valor !== 'string') {
    throw new ValidacionError(`${campo} inválido`);
  }
  const texto = valor.trim();
  if (texto === '') {
    return null;
  }
  if (max !== undefined && texto.length > max) {
    throw new ValidacionError(`${campo} no puede superar ${max} caracteres`);
  }
  return texto;
}

export function leerId(valor: unknown, campo: string, obligatorio: true): number;
export function leerId(valor: unknown, campo: string, obligatorio: false): number | null;
export function leerId(valor: unknown, campo: string, obligatorio: boolean): number | null {
  if (valor === undefined || valor === null || valor === '') {
    if (obligatorio) {
      throw new ValidacionError(`${campo} es obligatorio`);
    }
    return null;
  }
  const id = Number(valor);
  if (!Number.isInteger(id) || id <= 0) {
    throw new ValidacionError(`${campo} inválido`);
  }
  return id;
}
