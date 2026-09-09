export class ValidacionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidacionError';
  }
}
