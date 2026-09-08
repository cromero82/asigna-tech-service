import { cargarEntorno } from './env';

describe('cargarEntorno', () => {
  it('no carga dotenv en test', () => {
    expect(process.env.NODE_ENV).toBe('test');
    cargarEntorno();
    expect(process.env.NODE_ENV).toBe('test');
  });
});
