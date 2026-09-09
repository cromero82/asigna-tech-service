import { NextFunction, Request, Response } from 'express';

export class HttpMetrics {
  private readonly startedAt = Date.now();
  private total = 0;
  private readonly byStatus = new Map<number, number>();

  readonly middleware = (_req: Request, res: Response, next: NextFunction): void => {
    res.on('finish', () => {
      this.total += 1;
      const status = res.statusCode;
      this.byStatus.set(status, (this.byStatus.get(status) ?? 0) + 1);
    });
    next();
  };

  snapshot(): {
    uptimeSeconds: number;
    httpRequestsTotal: number;
    httpRequestsByStatus: Record<string, number>;
  } {
    return {
      uptimeSeconds: Math.floor((Date.now() - this.startedAt) / 1000),
      httpRequestsTotal: this.total,
      httpRequestsByStatus: Object.fromEntries(
        [...this.byStatus.entries()].map(([codigo, cantidad]) => [String(codigo), cantidad])
      )
    };
  }
}
