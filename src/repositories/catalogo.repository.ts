import { Pool } from 'pg';
import {
  CatalogoItemResponse,
  EstadoPrioridadResultadoResponse,
  ServicioGrupoResponse,
  TecnicoItemResponse,
  TipoServicioItemResponse
} from '../dtos/response/catalogo.response';
import { RecursoNoEncontradoError } from '../exceptions/recurso-no-encontrado.error';

type ServicioFila = {
  especialidadId: number;
  especialidadNombre: string;
  tipoServicioId: number;
  tipoServicioNombre: string;
};

export class CatalogoRepository {
  constructor(private readonly pool: Pool) {}

  async listarTiposTecnico(): Promise<CatalogoItemResponse[]> {
    const result = await this.pool.query<CatalogoItemResponse>(
      `SELECT id, nombre FROM tipo_tecnico WHERE activo = TRUE ORDER BY nombre`
    );
    return result.rows;
  }

  async listarServicios(): Promise<ServicioGrupoResponse[]> {
    const result = await this.pool.query<ServicioFila>(
      `SELECT
         tt.id AS "especialidadId",
         tt.nombre AS "especialidadNombre",
         ts.id AS "tipoServicioId",
         ts.nombre AS "tipoServicioNombre"
       FROM tipo_tecnico tt
       INNER JOIN tipo_servicio ts
         ON ts.tipo_tecnico_id = tt.id AND ts.activo = TRUE
       WHERE tt.activo = TRUE
       ORDER BY tt.nombre, ts.nombre`
    );
    const grupos = new Map<number, ServicioGrupoResponse>();
    for (const fila of result.rows) {
      let grupo = grupos.get(fila.especialidadId);
      if (!grupo) {
        grupo = {
          id: fila.especialidadId,
          nombre: fila.especialidadNombre,
          tiposServicio: []
        };
        grupos.set(fila.especialidadId, grupo);
      }
      grupo.tiposServicio.push({
        id: fila.tipoServicioId,
        nombre: fila.tipoServicioNombre,
        tipoTecnicoId: fila.especialidadId
      });
    }
    return [...grupos.values()];
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

  async buscarTipoTecnicoPorId(id: number): Promise<CatalogoItemResponse | null> {
    const result = await this.pool.query<CatalogoItemResponse>(
      `SELECT id, nombre FROM tipo_tecnico WHERE id = $1 AND activo = TRUE`,
      [id]
    );
    return result.rows[0] ?? null;
  }

  async buscarTipoServicioPorId(id: number): Promise<TipoServicioItemResponse | null> {
    const result = await this.pool.query<TipoServicioItemResponse>(
      `SELECT id, nombre, tipo_tecnico_id AS "tipoTecnicoId"
       FROM tipo_servicio WHERE id = $1 AND activo = TRUE`,
      [id]
    );
    return result.rows[0] ?? null;
  }

  async buscarTecnicoPorId(id: number): Promise<TecnicoItemResponse | null> {
    const result = await this.pool.query<TecnicoItemResponse>(
      `SELECT id, nombre, correo, tipo_tecnico_id AS "tipoTecnicoId"
       FROM tecnico WHERE id = $1 AND activo = TRUE`,
      [id]
    );
    return result.rows[0] ?? null;
  }

  async buscarObjetoPorId(id: number): Promise<CatalogoItemResponse | null> {
    const result = await this.pool.query<CatalogoItemResponse>(
      `SELECT id, nombre FROM objeto WHERE id = $1 AND activo = TRUE`,
      [id]
    );
    return result.rows[0] ?? null;
  }

  async buscarEstadoPorId(id: number): Promise<EstadoPrioridadResultadoResponse | null> {
    const result = await this.pool.query<EstadoPrioridadResultadoResponse>(
      `SELECT id, codigo, nombre FROM estado_solicitud WHERE id = $1 AND activo = TRUE`,
      [id]
    );
    return result.rows[0] ?? null;
  }

  async buscarPrioridadPorId(id: number): Promise<EstadoPrioridadResultadoResponse | null> {
    const result = await this.pool.query<EstadoPrioridadResultadoResponse>(
      `SELECT id, codigo, nombre FROM prioridad WHERE id = $1 AND activo = TRUE`,
      [id]
    );
    return result.rows[0] ?? null;
  }

  async buscarResultadoPorId(id: number): Promise<EstadoPrioridadResultadoResponse | null> {
    const result = await this.pool.query<EstadoPrioridadResultadoResponse>(
      `SELECT id, codigo, nombre FROM resultado_solicitud WHERE id = $1 AND activo = TRUE`,
      [id]
    );
    return result.rows[0] ?? null;
  }

  async crearTipoTecnico(
    nombre: string,
    descripcion: string | null
  ): Promise<CatalogoItemResponse> {
    const result = await this.pool.query<CatalogoItemResponse>(
      `INSERT INTO tipo_tecnico (nombre, descripcion) VALUES ($1, $2) RETURNING id, nombre`,
      [nombre, descripcion]
    );
    return result.rows[0];
  }

  async actualizarTipoTecnico(
    id: number,
    nombre: string,
    descripcion: string | null
  ): Promise<CatalogoItemResponse> {
    const result = await this.pool.query<CatalogoItemResponse>(
      `UPDATE tipo_tecnico
       SET nombre = $2, descripcion = $3, actualizado_en = now()
       WHERE id = $1 AND activo = TRUE
       RETURNING id, nombre`,
      [id, nombre, descripcion]
    );
    const row = result.rows[0];
    if (!row) {
      throw new RecursoNoEncontradoError('Especialidad', id);
    }
    return row;
  }

  async borrarLogicoTipoTecnico(id: number): Promise<void> {
    await this.borrarLogico('tipo_tecnico', 'Especialidad', id);
  }

  async crearTipoServicio(
    nombre: string,
    descripcion: string | null,
    tipoTecnicoId: number
  ): Promise<TipoServicioItemResponse> {
    const result = await this.pool.query<TipoServicioItemResponse>(
      `INSERT INTO tipo_servicio (nombre, descripcion, tipo_tecnico_id)
       VALUES ($1, $2, $3)
       RETURNING id, nombre, tipo_tecnico_id AS "tipoTecnicoId"`,
      [nombre, descripcion, tipoTecnicoId]
    );
    return result.rows[0];
  }

  async actualizarTipoServicio(
    id: number,
    nombre: string,
    descripcion: string | null,
    tipoTecnicoId: number
  ): Promise<TipoServicioItemResponse> {
    const result = await this.pool.query<TipoServicioItemResponse>(
      `UPDATE tipo_servicio
       SET nombre = $2, descripcion = $3, tipo_tecnico_id = $4, actualizado_en = now()
       WHERE id = $1 AND activo = TRUE
       RETURNING id, nombre, tipo_tecnico_id AS "tipoTecnicoId"`,
      [id, nombre, descripcion, tipoTecnicoId]
    );
    const row = result.rows[0];
    if (!row) {
      throw new RecursoNoEncontradoError('Servicio', id);
    }
    return row;
  }

  async borrarLogicoTipoServicio(id: number): Promise<void> {
    await this.borrarLogico('tipo_servicio', 'Servicio', id);
  }

  async crearTecnico(
    nombre: string,
    correo: string | null,
    tipoTecnicoId: number
  ): Promise<TecnicoItemResponse> {
    const result = await this.pool.query<TecnicoItemResponse>(
      `INSERT INTO tecnico (nombre, correo, tipo_tecnico_id)
       VALUES ($1, $2, $3)
       RETURNING id, nombre, correo, tipo_tecnico_id AS "tipoTecnicoId"`,
      [nombre, correo, tipoTecnicoId]
    );
    return result.rows[0];
  }

  async actualizarTecnico(
    id: number,
    nombre: string,
    correo: string | null,
    tipoTecnicoId: number
  ): Promise<TecnicoItemResponse> {
    const result = await this.pool.query<TecnicoItemResponse>(
      `UPDATE tecnico
       SET nombre = $2, correo = $3, tipo_tecnico_id = $4, actualizado_en = now()
       WHERE id = $1 AND activo = TRUE
       RETURNING id, nombre, correo, tipo_tecnico_id AS "tipoTecnicoId"`,
      [id, nombre, correo, tipoTecnicoId]
    );
    const row = result.rows[0];
    if (!row) {
      throw new RecursoNoEncontradoError('Técnico', id);
    }
    return row;
  }

  async borrarLogicoTecnico(id: number): Promise<void> {
    await this.borrarLogico('tecnico', 'Técnico', id);
  }

  async crearObjeto(nombre: string): Promise<CatalogoItemResponse> {
    const result = await this.pool.query<CatalogoItemResponse>(
      `INSERT INTO objeto (nombre) VALUES ($1) RETURNING id, nombre`,
      [nombre]
    );
    return result.rows[0];
  }

  async actualizarObjeto(id: number, nombre: string): Promise<CatalogoItemResponse> {
    const result = await this.pool.query<CatalogoItemResponse>(
      `UPDATE objeto
       SET nombre = $2, actualizado_en = now()
       WHERE id = $1 AND activo = TRUE
       RETURNING id, nombre`,
      [id, nombre]
    );
    const row = result.rows[0];
    if (!row) {
      throw new RecursoNoEncontradoError('Objeto', id);
    }
    return row;
  }

  async borrarLogicoObjeto(id: number): Promise<void> {
    await this.borrarLogico('objeto', 'Objeto', id);
  }

  private async borrarLogico(
    tabla: 'tipo_tecnico' | 'tipo_servicio' | 'tecnico' | 'objeto',
    recurso: string,
    id: number
  ): Promise<void> {
    const result = await this.pool.query(
      `UPDATE ${tabla} SET activo = FALSE, actualizado_en = now()
       WHERE id = $1 AND activo = TRUE`,
      [id]
    );
    if (result.rowCount === 0) {
      throw new RecursoNoEncontradoError(recurso, id);
    }
  }
}
