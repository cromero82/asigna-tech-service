export type HealthStatus = 'UP' | 'DOWN';

export interface HealthResponse {
  status: HealthStatus;
  database: HealthStatus;
  uptimeSeconds?: number;
  environment?: string;
}
