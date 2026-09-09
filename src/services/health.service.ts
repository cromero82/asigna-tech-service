import { HealthResponse } from '../dtos/response/health.response';

export interface HealthService {
  check(): Promise<HealthResponse>;
}
