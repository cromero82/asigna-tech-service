import { HealthResponse } from '../../dtos/response/health.response';
import { AppLogger } from '../../config/logger';
import { HealthRepository } from '../../repositories/health.repository';
import { HealthService } from '../health.service';

export class HealthServiceImpl implements HealthService {
  constructor(
    private readonly healthRepository: HealthRepository,
    private readonly logger: AppLogger
  ) {}

  async check(): Promise<HealthResponse> {
    this.logger.info('HealthService.check inicio');
    const databaseUp = await this.healthRepository.ping();
    const database = databaseUp ? 'UP' : 'DOWN';
    const status = databaseUp ? 'UP' : 'DOWN';
    this.logger.info({ database }, 'HealthService.check fin');
    return { status, database };
  }
}
