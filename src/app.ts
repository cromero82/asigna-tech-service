import cors from 'cors';
import express, { Express, Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { AppContainer } from './config/container';
import { appConfig } from './config/app-config';
import { registrarSwagger } from './docs/swagger';
import { HttpMetrics } from './middlewares/http-metrics.middleware';
import { unhandledErrorMiddleware } from './middlewares/unhandled-error.middleware';

function esRutaObservabilidad(path: string): boolean {
  return (
    path === '/health' ||
    path === '/metrics' ||
    path === '/v3/api-docs' ||
    path.startsWith('/swagger-ui')
  );
}

export function createApp(container: AppContainer): Express {
  const app = express();
  const metrics = new HttpMetrics();

  app.disable('x-powered-by');
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false
    })
  );
  app.use(cors({ origin: appConfig.corsOrigin }));
  app.use(express.json({ limit: appConfig.jsonBodyLimit }));
  app.use(
    rateLimit({
      windowMs: appConfig.rateLimit.windowMs,
      limit: appConfig.rateLimit.max,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
      skip: (req) => esRutaObservabilidad(req.path)
    })
  );
  app.use(
    pinoHttp({
      logger: container.logger,
      autoLogging: {
        ignore: (req) => esRutaObservabilidad((req.url ?? '').split('?')[0] ?? '')
      },
      serializers: {
        req(req) {
          return { id: req.id, method: req.method, url: req.url };
        },
        res(res) {
          return { statusCode: res.statusCode };
        }
      }
    })
  );
  app.use(metrics.middleware);
  registrarSwagger(app);

  const router = Router();
  container.healthController.register(router);
  container.solicitudController.register(router);
  container.catalogoController.register(router);
  router.get('/metrics', (_req, res) => {
    res.json(metrics.snapshot());
  });
  app.use(router);
  app.use(unhandledErrorMiddleware(container.logger));

  return app;
}
