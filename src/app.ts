import cors from 'cors';
import express, { Express, Router } from 'express';
import { AppContainer } from './config/container';
import { registrarSwagger } from './docs/swagger';
import { unhandledErrorMiddleware } from './middlewares/unhandled-error.middleware';

export function createApp(container: AppContainer): Express {
  const app = express();
  app.use(cors({ origin: 'http://localhost:4200' }));
  app.use(express.json());
  registrarSwagger(app);

  const router = Router();
  container.healthController.register(router);
  container.solicitudController.register(router);
  container.catalogoController.register(router);
  app.use(router);
  app.use(unhandledErrorMiddleware(container.logger));

  return app;
}
