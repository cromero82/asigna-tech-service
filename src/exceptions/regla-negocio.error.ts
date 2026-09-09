export class ReglaNegocioError extends Error {
  readonly status = 412;

  constructor(message: string) {
    super(message);
    this.name = 'ReglaNegocioError';
  }
}
