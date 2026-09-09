import { HttpMetrics } from './http-metrics.middleware';

describe('HttpMetrics', () => {
  it('cuenta status al terminar la respuesta', () => {
    const metrics = new HttpMetrics();
    const listeners: Array<() => void> = [];
    const res = {
      statusCode: 200,
      on(event: string, cb: () => void) {
        if (event === 'finish') {
          listeners.push(cb);
        }
      }
    };
    metrics.middleware({} as never, res as never, () => undefined);
    listeners.forEach((cb) => cb());
    expect(metrics.snapshot().httpRequestsTotal).toBe(1);
    expect(metrics.snapshot().httpRequestsByStatus['200']).toBe(1);
    expect(metrics.snapshot().uptimeSeconds).toBeGreaterThanOrEqual(0);
  });
});
