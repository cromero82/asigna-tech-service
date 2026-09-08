import { NextFunction, Request, Response, Router } from 'express';
import { AppLogger } from '../config/logger';
import { CatalogoService } from '../services/catalogo.service';

export class CatalogoController {
  constructor(
    private readonly catalogoService: CatalogoService,
    private readonly logger: AppLogger
  ) {}

  register(router: Router): void {
    router.get('/api/tipos-tecnico', this.tiposTecnico);
    router.post('/api/tipos-tecnico', this.crearTipoTecnico);
    router.put('/api/tipos-tecnico/:id', this.actualizarTipoTecnico);
    router.delete('/api/tipos-tecnico/:id', this.eliminarTipoTecnico);
    router.get('/api/servicios', this.servicios);
    router.get('/api/tipos-servicio', this.tiposServicio);
    router.post('/api/tipos-servicio', this.crearTipoServicio);
    router.put('/api/tipos-servicio/:id', this.actualizarTipoServicio);
    router.delete('/api/tipos-servicio/:id', this.eliminarTipoServicio);
    router.get('/api/tecnicos', this.tecnicos);
    router.post('/api/tecnicos', this.crearTecnico);
    router.put('/api/tecnicos/:id', this.actualizarTecnico);
    router.delete('/api/tecnicos/:id', this.eliminarTecnico);
    router.get('/api/objetos', this.objetos);
    router.post('/api/objetos', this.crearObjeto);
    router.put('/api/objetos/:id', this.actualizarObjeto);
    router.delete('/api/objetos/:id', this.eliminarObjeto);
    router.get('/api/estados-solicitud', this.estados);
    router.get('/api/prioridades', this.prioridades);
    router.get('/api/resultados-solicitud', this.resultados);
  }

  private tiposTecnico = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    this.logger.info('CatalogoController.tiposTecnico inicio');
    try {
      res.status(200).json(await this.catalogoService.listarTiposTecnico());
    } catch (error) {
      this.logger.error({ err: error }, 'CatalogoController.tiposTecnico error');
      next(error);
    } finally {
      this.logger.info('CatalogoController.tiposTecnico fin');
    }
  };

  private servicios = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    this.logger.info('CatalogoController.servicios inicio');
    try {
      res.status(200).json(await this.catalogoService.listarServicios());
    } catch (error) {
      this.logger.error({ err: error }, 'CatalogoController.servicios error');
      next(error);
    } finally {
      this.logger.info('CatalogoController.servicios fin');
    }
  };

  private tiposServicio = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    this.logger.info('CatalogoController.tiposServicio inicio');
    try {
      const tipoTecnicoId = this.leerFiltroOpcional(req, res);
      if (tipoTecnicoId === false) {
        return;
      }
      res
        .status(200)
        .json(await this.catalogoService.listarTiposServicio(tipoTecnicoId));
    } catch (error) {
      this.logger.error({ err: error }, 'CatalogoController.tiposServicio error');
      next(error);
    } finally {
      this.logger.info('CatalogoController.tiposServicio fin');
    }
  };

  private tecnicos = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    this.logger.info('CatalogoController.tecnicos inicio');
    try {
      const tipoTecnicoId = this.leerFiltroOpcional(req, res);
      if (tipoTecnicoId === false) {
        return;
      }
      res.status(200).json(await this.catalogoService.listarTecnicos(tipoTecnicoId));
    } catch (error) {
      this.logger.error({ err: error }, 'CatalogoController.tecnicos error');
      next(error);
    } finally {
      this.logger.info('CatalogoController.tecnicos fin');
    }
  };

  private objetos = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    this.logger.info('CatalogoController.objetos inicio');
    try {
      res.status(200).json(await this.catalogoService.listarObjetos());
    } catch (error) {
      this.logger.error({ err: error }, 'CatalogoController.objetos error');
      next(error);
    } finally {
      this.logger.info('CatalogoController.objetos fin');
    }
  };

  private estados = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    this.logger.info('CatalogoController.estados inicio');
    try {
      res.status(200).json(await this.catalogoService.listarEstados());
    } catch (error) {
      this.logger.error({ err: error }, 'CatalogoController.estados error');
      next(error);
    } finally {
      this.logger.info('CatalogoController.estados fin');
    }
  };

  private prioridades = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    this.logger.info('CatalogoController.prioridades inicio');
    try {
      res.status(200).json(await this.catalogoService.listarPrioridades());
    } catch (error) {
      this.logger.error({ err: error }, 'CatalogoController.prioridades error');
      next(error);
    } finally {
      this.logger.info('CatalogoController.prioridades fin');
    }
  };

  private resultados = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    this.logger.info('CatalogoController.resultados inicio');
    try {
      res.status(200).json(await this.catalogoService.listarResultados());
    } catch (error) {
      this.logger.error({ err: error }, 'CatalogoController.resultados error');
      next(error);
    } finally {
      this.logger.info('CatalogoController.resultados fin');
    }
  };

  private crearTipoTecnico = this.escribir('crearTipoTecnico', 201, (req) =>
    this.catalogoService.crearTipoTecnico(req.body)
  );
  private actualizarTipoTecnico = this.escribirConId(
    'actualizarTipoTecnico',
    200,
    (id, req) => this.catalogoService.actualizarTipoTecnico(id, req.body)
  );
  private eliminarTipoTecnico = this.eliminarConId('eliminarTipoTecnico', (id) =>
    this.catalogoService.eliminarTipoTecnico(id)
  );

  private crearTipoServicio = this.escribir('crearTipoServicio', 201, (req) =>
    this.catalogoService.crearTipoServicio(req.body)
  );
  private actualizarTipoServicio = this.escribirConId(
    'actualizarTipoServicio',
    200,
    (id, req) => this.catalogoService.actualizarTipoServicio(id, req.body)
  );
  private eliminarTipoServicio = this.eliminarConId('eliminarTipoServicio', (id) =>
    this.catalogoService.eliminarTipoServicio(id)
  );

  private crearTecnico = this.escribir('crearTecnico', 201, (req) =>
    this.catalogoService.crearTecnico(req.body)
  );
  private actualizarTecnico = this.escribirConId('actualizarTecnico', 200, (id, req) =>
    this.catalogoService.actualizarTecnico(id, req.body)
  );
  private eliminarTecnico = this.eliminarConId('eliminarTecnico', (id) =>
    this.catalogoService.eliminarTecnico(id)
  );

  private crearObjeto = this.escribir('crearObjeto', 201, (req) =>
    this.catalogoService.crearObjeto(req.body)
  );
  private actualizarObjeto = this.escribirConId('actualizarObjeto', 200, (id, req) =>
    this.catalogoService.actualizarObjeto(id, req.body)
  );
  private eliminarObjeto = this.eliminarConId('eliminarObjeto', (id) =>
    this.catalogoService.eliminarObjeto(id)
  );

  private escribir(
    accion: string,
    status: number,
    ejecutar: (req: Request) => Promise<unknown>
  ) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      this.logger.info(`CatalogoController.${accion} inicio`);
      try {
        res.status(status).json(await ejecutar(req));
      } catch (error) {
        this.logger.error({ err: error }, `CatalogoController.${accion} error`);
        next(error);
      } finally {
        this.logger.info(`CatalogoController.${accion} fin`);
      }
    };
  }

  private escribirConId(
    accion: string,
    status: number,
    ejecutar: (id: number, req: Request) => Promise<unknown>
  ) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      this.logger.info(`CatalogoController.${accion} inicio`);
      try {
        const id = this.leerId(req, res);
        if (id === null) {
          return;
        }
        res.status(status).json(await ejecutar(id, req));
      } catch (error) {
        this.logger.error({ err: error }, `CatalogoController.${accion} error`);
        next(error);
      } finally {
        this.logger.info(`CatalogoController.${accion} fin`);
      }
    };
  }

  private eliminarConId(accion: string, ejecutar: (id: number) => Promise<void>) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      this.logger.info(`CatalogoController.${accion} inicio`);
      try {
        const id = this.leerId(req, res);
        if (id === null) {
          return;
        }
        await ejecutar(id);
        res.status(204).send();
      } catch (error) {
        this.logger.error({ err: error }, `CatalogoController.${accion} error`);
        next(error);
      } finally {
        this.logger.info(`CatalogoController.${accion} fin`);
      }
    };
  }

  private leerId(req: Request, res: Response): number | null {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ status: 400, message: 'id inválido' });
      return null;
    }
    return id;
  }

  private leerFiltroOpcional(req: Request, res: Response): number | undefined | false {
    const crudo = req.query.tipoTecnicoId;
    if (crudo === undefined || crudo === '') {
      return undefined;
    }
    const id = Number(crudo);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ status: 400, message: 'tipoTecnicoId inválido' });
      return false;
    }
    return id;
  }
}
