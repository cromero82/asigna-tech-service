import { HealthRepository } from '../../repositories/health.repository';
import { loggerSilencioso } from '../../test/helpers';
import { HealthServiceImpl } from './health.service.impl';

describe('HealthServiceImpl', () => {
  it('está UP si el ping responde', async () => {
    const repo = { ping: jest.fn().mockResolvedValue(true) } as unknown as HealthRepository;
    const service = new HealthServiceImpl(repo, loggerSilencioso);
    await expect(service.check()).resolves.toEqual({ status: 'UP', database: 'UP' });
  });

  it('está DOWN si el ping falla', async () => {
    const repo = { ping: jest.fn().mockResolvedValue(false) } as unknown as HealthRepository;
    const service = new HealthServiceImpl(repo, loggerSilencioso);
    await expect(service.check()).resolves.toEqual({ status: 'DOWN', database: 'DOWN' });
  });
});
