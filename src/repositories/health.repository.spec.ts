import { Pool } from 'pg';
import { HealthRepository } from './health.repository';

describe('HealthRepository', () => {
  it('devuelve true si SELECT 1 responde', async () => {
    const repo = new HealthRepository({
      query: jest.fn().mockResolvedValue({ rows: [{ '?column?': 1 }] })
    } as unknown as Pool);
    await expect(repo.ping()).resolves.toBe(true);
  });

  it('devuelve false si la consulta falla', async () => {
    const repo = new HealthRepository({
      query: jest.fn().mockRejectedValue(new Error('down'))
    } as unknown as Pool);
    await expect(repo.ping()).resolves.toBe(false);
  });
});
