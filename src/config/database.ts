import { Pool } from 'pg';
import { appConfig } from './app-config';

export function createPool(): Pool {
  return new Pool({
    host: appConfig.database.host,
    port: appConfig.database.port,
    user: appConfig.database.user,
    database: appConfig.database.database,
    password: appConfig.database.password,
    max: 10
  });
}

export async function verificarConexion(pool: Pool): Promise<void> {
  await pool.query('SELECT 1');
}
