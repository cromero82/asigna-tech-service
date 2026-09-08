import './env';

function entero(valor: string | undefined, fallback: number): number {
  if (!valor) {
    return fallback;
  }
  const n = Number(valor);
  return Number.isFinite(n) && n > 0 ? Math.trunc(n) : fallback;
}

export const appConfig = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: entero(process.env.PORT, 3000),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:4200',
  logLevel: process.env.LOG_LEVEL ?? 'info',
  jsonBodyLimit: process.env.JSON_BODY_LIMIT ?? '32kb',
  rateLimit: {
    windowMs: entero(process.env.RATE_LIMIT_WINDOW_MS, 60_000),
    max: entero(process.env.RATE_LIMIT_MAX, 200)
  },
  database: {
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: entero(process.env.DATABASE_PORT, 5432),
    user: process.env.DATABASE_USER ?? 'romax-admin',
    database: process.env.DATABASE_NAME ?? 'asigna_tech_db',
    password: process.env.DATABASE_PASSWORD ?? ''
  }
};
