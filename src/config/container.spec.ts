jest.mock('./database', () => ({
  createPool: () => ({ query: jest.fn() })
}));

jest.mock('./logger', () => {
  const pino = require('pino');
  return { createLogger: () => pino({ level: 'silent' }) };
});

import { createContainer } from './container';

describe('createContainer', () => {
  it('arma controllers por constructor', () => {
    const container = createContainer();
    expect(container.healthController).toBeDefined();
    expect(container.solicitudController).toBeDefined();
    expect(container.catalogoController).toBeDefined();
  });
});
