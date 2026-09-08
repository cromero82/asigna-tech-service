import { NextFunction, Request, Response, Router } from 'express';
import { appConfig } from '../config/app-config';
import { AppLogger } from '../config/logger';
import { HealthService } from '../services/health.service';

export class HealthController {
  constructor(
    private readonly healthService: HealthService,
    private readonly logger: AppLogger
  ) {}

  register(router: Router): void {
    router.get('/health', this.getHealth);
  }

  private getHealth = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    this.logger.info('HealthController.getHealth inicio');
    try {
      const chequeo = await this.healthService.check();
      const body = {
        ...chequeo,
        uptimeSeconds: Math.floor(process.uptime()),
        environment: appConfig.nodeEnv
      };
      const httpStatus = body.status === 'UP' ? 200 : 503;
      res.status(httpStatus).json(body);
    } catch (error) {
      this.logger.error({ err: error }, 'HealthController.getHealth error');
      next(error);
    } finally {
      this.logger.info('HealthController.getHealth fin');
    }
  };
}
