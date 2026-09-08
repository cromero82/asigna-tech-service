import { appConfig } from './config/app-config';
import { createContainer } from './config/container';
import { verificarConexion } from './config/database';
import { createApp } from './app';

async function main(): Promise<void> {
  const container = createContainer();
  const { logger, pool } = container;

  try {
    await verificarConexion(pool);
    logger.info('conexion a PostgreSQL verificada');
  } catch (error) {
    logger.error({ err: error }, 'no se pudo conectar a PostgreSQL');
    await pool.end();
    process.exit(1);
  }

  const app = createApp(container);
  const server = app.listen(appConfig.port, () => {
    logger.info({ port: appConfig.port }, 'asigna-tech-service en escucha');
  });

  const shutdown = async (signal: string): Promise<void> => {
    logger.info({ signal }, 'apagando servicio');
    server.close();
    await pool.end();
    process.exit(0);
  };

  process.on('SIGINT', () => {
    void shutdown('SIGINT');
  });
  process.on('SIGTERM', () => {
    void shutdown('SIGTERM');
  });
}

void main();
