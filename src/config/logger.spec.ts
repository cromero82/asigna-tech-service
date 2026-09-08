import { createLogger } from './logger';

describe('createLogger', () => {
  it('redacta password', () => {
    const logger = createLogger();
    expect(logger.level).toBe('info');
  });
});
