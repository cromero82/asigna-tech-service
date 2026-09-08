import { NextFunction, Request, Response, Router } from 'express';
import { AppLogger } from '../config/logger';
import { SolicitudService } from '../services/solicitud.service';
import {
  validarActualizarSolicitud,
  validarCrearSolicitud
} from '../validators/solicitud.request.validator';

export class SolicitudController {
  constructor(
    private readonly solicitudService: SolicitudService,
    private readonly logger: AppLogger
  ) {}

  register(router: Router): void {
    router.get('/api/solicitudes', this.listar);
    router.get('/api/solicitudes/:id', this.obtener);
    router.post('/api/solicitudes', this.crear);
    router.put('/api/solicitudes/:id', this.actualizar);
    router.delete('/api/solicitudes/:id', this.eliminar);
  }

  private listar = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    this.logger.info('SolicitudController.listar inicio');
    try {
      const lista = await this.solicitudService.listar();
      res.status(200).json(lista);
    } catch (error) {
      this.logger.error({ err: error }, 'SolicitudController.listar error');
      next(error);
    } finally {
      this.logger.info('SolicitudController.listar fin');
    }
  };

  private obtener = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    this.logger.info('SolicitudController.obtener inicio');
    try {
      const id = this.leerId(req, res);
      if (id === null) {
        return;
      }
      const solicitud = await this.solicitudService.obtenerPorId(id);
      res.status(200).json(solicitud);
    } catch (error) {
      this.logger.error({ err: error }, 'SolicitudController.obtener error');
      next(error);
    } finally {
      this.logger.info('SolicitudController.obtener fin');
    }
  };

  private crear = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    this.logger.info('SolicitudController.crear inicio');
    try {
      const creada = await this.solicitudService.crear(validarCrearSolicitud(req.body));
      res.status(201).json(creada);
    } catch (error) {
      this.logger.error({ err: error }, 'SolicitudController.crear error');
      next(error);
    } finally {
      this.logger.info('SolicitudController.crear fin');
    }
  };

  private actualizar = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    this.logger.info('SolicitudController.actualizar inicio');
    try {
      const id = this.leerId(req, res);
      if (id === null) {
        return;
      }
      const actualizada = await this.solicitudService.actualizar(
        id,
        validarActualizarSolicitud(req.body)
      );
      res.status(200).json(actualizada);
    } catch (error) {
      this.logger.error({ err: error }, 'SolicitudController.actualizar error');
      next(error);
    } finally {
      this.logger.info('SolicitudController.actualizar fin');
    }
  };

  private eliminar = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    this.logger.info('SolicitudController.eliminar inicio');
    try {
      const id = this.leerId(req, res);
      if (id === null) {
        return;
      }
      await this.solicitudService.eliminar(id);
      res.status(204).send();
    } catch (error) {
      this.logger.error({ err: error }, 'SolicitudController.eliminar error');
      next(error);
    } finally {
      this.logger.info('SolicitudController.eliminar fin');
    }
  };

  private leerId(req: Request, res: Response): number | null {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ status: 400, message: 'id inválido' });
      return null;
    }
    return id;
  }
}
