import { Pool } from 'pg';
import {
  CatalogoItemResponse,
  EstadoPrioridadResultadoResponse,
  TecnicoItemResponse,
  TipoServicioItemResponse
} from '../dtos/response/catalogo.response';

export class CatalogoRepository {
  constructor(private readonly pool: Pool) {}

  async listarTiposTecnico(): Promise<CatalogoItemResponse[]> {
    const result = await this.pool.query<CatalogoItemResponse>(
      `SELECT id, nombre FROM tipo_tecnico WHERE activo = TRUE ORDER BY nombre`
    );
    return result.rows;
  }

  async listarTiposServicio(tipoTecnicoId?: number): Promise<TipoServicioItemResponse[]> {
    if (tipoTecnicoId === undefined) {
      const result = await this.pool.query<TipoServicioItemResponse>(
        `SELECT id, nombre, tipo_tecnico_id AS "tipoTecnicoId"
         FROM tipo_servicio WHERE activo = TRUE ORDER BY nombre`
      );
      return result.rows;
    }
    const result = await this.pool.query<TipoServicioItemResponse>(
      `SELECT id, nombre, tipo_tecnico_id AS "tipoTecnicoId"
       FROM tipo_servicio
       WHERE activo = TRUE AND tipo_tecnico_id = $1
       ORDER BY nombre`,
      [tipoTecnicoId]
    );
    return result.rows;
  }

  async listarTecnicos(tipoTecnicoId?: number): Promise<TecnicoItemResponse[]> {
    if (tipoTecnicoId === undefined) {
      const result = await this.pool.query<TecnicoItemResponse>(
        `SELECT id, nombre, correo, tipo_tecnico_id AS "tipoTecnicoId"
         FROM tecnico WHERE activo = TRUE ORDER BY nombre`
      );
      return result.rows;
    }
    const result = await this.pool.query<TecnicoItemResponse>(
      `SELECT id, nombre, correo, tipo_tecnico_id AS "tipoTecnicoId"
       FROM tecnico
       WHERE activo = TRUE AND tipo_tecnico_id = $1
       ORDER BY nombre`,
      [tipoTecnicoId]
    );
    return result.rows;
  }

  async listarObjetos(): Promise<CatalogoItemResponse[]> {
    const result = await this.pool.query<CatalogoItemResponse>(
      `SELECT id, nombre FROM objeto WHERE activo = TRUE ORDER BY nombre`
    );
    return result.rows;
  }

  async listarEstados(): Promise<EstadoPrioridadResultadoResponse[]> {
    const result = await this.pool.query<EstadoPrioridadResultadoResponse>(
      `SELECT id, codigo, nombre FROM estado_solicitud WHERE activo = TRUE ORDER BY id`
    );
    return result.rows;
  }

  async listarPrioridades(): Promise<EstadoPrioridadResultadoResponse[]> {
    const result = await this.pool.query<EstadoPrioridadResultadoResponse>(
      `SELECT id, codigo, nombre FROM prioridad WHERE activo = TRUE ORDER BY orden`
    );
    return result.rows;
  }

  async listarResultados(): Promise<EstadoPrioridadResultadoResponse[]> {
    const result = await this.pool.query<EstadoPrioridadResultadoResponse>(
      `SELECT id, codigo, nombre FROM resultado_solicitud WHERE activo = TRUE ORDER BY id`
    );
    return result.rows;
  }

  async buscarEstadoIdPorCodigo(codigo: string): Promise<number> {
    const result = await this.pool.query<{ id: number }>(
      `SELECT id FROM estado_solicitud WHERE codigo = $1 AND activo = TRUE`,
      [codigo]
    );
    return result.rows[0].id;
  }

  async buscarPrioridadIdPorCodigo(codigo: string): Promise<number> {
    const result = await this.pool.query<{ id: number }>(
      `SELECT id FROM prioridad WHERE codigo = $1 AND activo = TRUE`,
      [codigo]
    );
    return result.rows[0].id;
  }
}
