export class RecursoNoEncontradoError extends Error {
  constructor(recurso: string, id: number) {
    super(`${recurso} ${id} no existe`);
    this.name = 'RecursoNoEncontradoError';
  }
}
