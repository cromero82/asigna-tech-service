import dotenv from 'dotenv';

/** Carga `.env` fuera de Jest para no contaminar el umbral de tests. */
export function cargarEntorno(): void {
  if (process.env.NODE_ENV === 'test') {
    return;
  }
  dotenv.config();
}

cargarEntorno();
