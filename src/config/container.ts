import { Pool } from 'pg';
import { createPool } from './database';
import { AppLogger, createLogger } from './logger';
import { CatalogoController } from '../controllers/catalogo.controller';
import { HealthController } from '../controllers/health.controller';
import { SolicitudController } from '../controllers/solicitud.controller';
import { CatalogoRepository } from '../repositories/catalogo.repository';
import { HealthRepository } from '../repositories/health.repository';
import { SolicitudRepository } from '../repositories/solicitud.repository';
import { CatalogoServiceImpl } from '../services/impl/catalogo.service.impl';
import { HealthServiceImpl } from '../services/impl/health.service.impl';
import { SolicitudServiceImpl } from '../services/impl/solicitud.service.impl';

export interface AppContainer {
  pool: Pool;
  logger: AppLogger;
  healthController: HealthController;
  solicitudController: SolicitudController;
  catalogoController: CatalogoController;
}

export function createContainer(): AppContainer {
  const logger = createLogger();
  const pool = createPool();
  const healthRepository = new HealthRepository(pool);
  const solicitudRepository = new SolicitudRepository(pool);
  const catalogoRepository = new CatalogoRepository(pool);
  const healthService = new HealthServiceImpl(healthRepository, logger);
  const solicitudService = new SolicitudServiceImpl(
    solicitudRepository,
    catalogoRepository,
    logger
  );
  const catalogoService = new CatalogoServiceImpl(catalogoRepository, logger);
  return {
    pool,
    logger,
    healthController: new HealthController(healthService, logger),
    solicitudController: new SolicitudController(solicitudService, logger),
    catalogoController: new CatalogoController(catalogoService, logger)
  };
}
