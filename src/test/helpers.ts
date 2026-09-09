import pino from 'pino';
import { Pool } from 'pg';
import { createApp } from '../app';
import { AppContainer } from '../config/container';
import { HealthController } from '../controllers/health.controller';
import { CatalogoController } from '../controllers/catalogo.controller';
import { SolicitudController } from '../controllers/solicitud.controller';
import { CatalogoService } from '../services/catalogo.service';
import { HealthService } from '../services/health.service';
import { SolicitudService } from '../services/solicitud.service';

export const loggerSilencioso = pino({ level: 'silent' });

export function catalogoServiceMock(
  extras: Partial<CatalogoService> = {}
): CatalogoService {
  return {
    listarTiposTecnico: jest.fn().mockResolvedValue([]),
    listarServicios: jest.fn().mockResolvedValue([]),
    listarTiposServicio: jest.fn().mockResolvedValue([]),
    listarTecnicos: jest.fn().mockResolvedValue([]),
    listarObjetos: jest.fn().mockResolvedValue([]),
    listarEstados: jest.fn().mockResolvedValue([]),
    listarPrioridades: jest.fn().mockResolvedValue([]),
    listarResultados: jest.fn().mockResolvedValue([]),
    crearTipoTecnico: jest.fn(),
    actualizarTipoTecnico: jest.fn(),
    eliminarTipoTecnico: jest.fn(),
    crearTipoServicio: jest.fn(),
    actualizarTipoServicio: jest.fn(),
    eliminarTipoServicio: jest.fn(),
    crearTecnico: jest.fn(),
    actualizarTecnico: jest.fn(),
    eliminarTecnico: jest.fn(),
    crearObjeto: jest.fn(),
    actualizarObjeto: jest.fn(),
    eliminarObjeto: jest.fn(),
    ...extras
  };
}

export function crearAppPrueba(opciones: {
  solicitudService?: Partial<SolicitudService>;
  catalogoService?: Partial<CatalogoService>;
  healthService?: Partial<HealthService>;
} = {}) {
  const logger = loggerSilencioso;
  const solicitudService = {
    listar: jest.fn().mockResolvedValue([]),
    obtenerPorId: jest.fn(),
    crear: jest.fn(),
    actualizar: jest.fn(),
    eliminar: jest.fn(),
    ...opciones.solicitudService
  } as SolicitudService;
  const catalogoService = catalogoServiceMock(opciones.catalogoService);
  const healthService = {
    check: jest.fn().mockResolvedValue({ status: 'UP', database: 'UP' }),
    ...opciones.healthService
  } as HealthService;

  const container: AppContainer = {
    pool: {} as Pool,
    logger,
    healthController: new HealthController(healthService, logger),
    solicitudController: new SolicitudController(solicitudService, logger),
    catalogoController: new CatalogoController(catalogoService, logger)
  };
  return { app: createApp(container), solicitudService, catalogoService, healthService };
}
