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
    router.get('/api/tipos-servicio', this.tiposServicio);
    router.get('/api/tecnicos', this.tecnicos);
    router.get('/api/objetos', this.objetos);
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
