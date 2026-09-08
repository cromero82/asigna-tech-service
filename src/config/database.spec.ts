jest.mock('./secrets.local', () => ({ dbPassword: 'test' }));

import { Pool } from 'pg';
import { appConfig } from './app-config';
import { createPool, verificarConexion } from './database';

describe('database y app-config', () => {
  it('lee host local y puerto 3000', () => {
    expect(appConfig.port).toBe(3000);
    expect(appConfig.database.database).toBe('asigna_tech_db');
  });

  it('crea un Pool y verifica con SELECT 1', async () => {
    const pool = createPool();
    expect(pool).toBeInstanceOf(Pool);
    await pool.end();

    const query = jest.fn().mockResolvedValue({ rows: [{ '?column?': 1 }] });
    await verificarConexion({ query } as unknown as Pool);
    expect(query).toHaveBeenCalledWith('SELECT 1');
  });
});
