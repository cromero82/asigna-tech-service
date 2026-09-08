import express, { Express, Router } from 'express';
import { AppContainer } from './config/container';
import { unhandledErrorMiddleware } from './middlewares/unhandled-error.middleware';

export function createApp(container: AppContainer): Express {
  const app = express();
  app.use(express.json());

  const router = Router();
  container.healthController.register(router);
  container.solicitudController.register(router);
  container.catalogoController.register(router);
  app.use(router);
  app.use(unhandledErrorMiddleware(container.logger));

  return app;
}
