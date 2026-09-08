import { Pool } from 'pg';
import { SolicitudResponse } from '../dtos/response/solicitud.response';
import { RecursoNoEncontradoError } from '../exceptions/recurso-no-encontrado.error';

interface SolicitudRow {
  id: number;
  titulo: string;
  descripcion: string | null;
  observaciones: string | null;
  tipo_tecnico_id: number;
  tipo_tecnico_nombre: string;
  tipo_servicio_id: number;
  tipo_servicio_nombre: string;
  tecnico_id: number | null;
  tecnico_nombre: string | null;
  objeto_id: number;
  objeto_nombre: string;
  estado_id: number;
  estado_codigo: string;
  estado_nombre: string;
  prioridad_id: number;
  prioridad_codigo: string;
  prioridad_nombre: string;
  resultado_id: number | null;
  resultado_codigo: string | null;
  resultado_nombre: string | null;
  creado_en: Date;
  actualizado_en: Date;
}

const SELECT_SOLICITUD = `
  SELECT
    s.id,
    s.titulo,
    s.descripcion,
    s.observaciones,
    tt.id AS tipo_tecnico_id,
    tt.nombre AS tipo_tecnico_nombre,
    ts.id AS tipo_servicio_id,
    ts.nombre AS tipo_servicio_nombre,
    t.id AS tecnico_id,
    t.nombre AS tecnico_nombre,
    o.id AS objeto_id,
    o.nombre AS objeto_nombre,
    e.id AS estado_id,
    e.codigo AS estado_codigo,
    e.nombre AS estado_nombre,
    p.id AS prioridad_id,
    p.codigo AS prioridad_codigo,
    p.nombre AS prioridad_nombre,
    r.id AS resultado_id,
    r.codigo AS resultado_codigo,
    r.nombre AS resultado_nombre,
    s.creado_en,
    s.actualizado_en
  FROM solicitud s
  INNER JOIN tipo_tecnico tt ON tt.id = s.tipo_tecnico_id
  INNER JOIN tipo_servicio ts ON ts.id = s.tipo_servicio_id
  LEFT JOIN tecnico t ON t.id = s.tecnico_id
  INNER JOIN objeto o ON o.id = s.objeto_id
  INNER JOIN estado_solicitud e ON e.id = s.estado_id
  INNER JOIN prioridad p ON p.id = s.prioridad_id
  LEFT JOIN resultado_solicitud r ON r.id = s.resultado_id
`;

export interface SolicitudInsert {
  titulo: string;
  descripcion: string | null;
  observaciones: string | null;
  tipoTecnicoId: number;
  tipoServicioId: number;
  tecnicoId: number | null;
  objetoId: number;
  estadoId: number;
  prioridadId: number;
  resultadoId: number | null;
}

export class SolicitudRepository {
  constructor(private readonly pool: Pool) {}

  async listarActivas(): Promise<SolicitudResponse[]> {
    const result = await this.pool.query<SolicitudRow>(
      `${SELECT_SOLICITUD} WHERE s.activo = TRUE ORDER BY s.id DESC`
    );
    return result.rows.map(mapRow);
  }

  async buscarActivaPorId(id: number): Promise<SolicitudResponse | null> {
    const result = await this.pool.query<SolicitudRow>(
      `${SELECT_SOLICITUD} WHERE s.id = $1 AND s.activo = TRUE`,
      [id]
    );
    const row = result.rows[0];
    return row ? mapRow(row) : null;
  }

  async crear(datos: SolicitudInsert): Promise<number> {
    const result = await this.pool.query<{ id: number }>(
      `INSERT INTO solicitud (
         titulo, descripcion, observaciones,
         tipo_tecnico_id, tipo_servicio_id, tecnico_id, objeto_id,
         estado_id, prioridad_id, resultado_id
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING id`,
      [
        datos.titulo,
        datos.descripcion,
        datos.observaciones,
        datos.tipoTecnicoId,
        datos.tipoServicioId,
        datos.tecnicoId,
        datos.objetoId,
        datos.estadoId,
        datos.prioridadId,
        datos.resultadoId
      ]
    );
    return result.rows[0].id;
  }

  async actualizar(id: number, datos: SolicitudInsert): Promise<void> {
    const result = await this.pool.query(
      `UPDATE solicitud SET
         titulo = $2,
         descripcion = $3,
         observaciones = $4,
         tipo_tecnico_id = $5,
         tipo_servicio_id = $6,
         tecnico_id = $7,
         objeto_id = $8,
         estado_id = $9,
         prioridad_id = $10,
         resultado_id = $11,
         actualizado_en = now()
       WHERE id = $1 AND activo = TRUE`,
      [
        id,
        datos.titulo,
        datos.descripcion,
        datos.observaciones,
        datos.tipoTecnicoId,
        datos.tipoServicioId,
        datos.tecnicoId,
        datos.objetoId,
        datos.estadoId,
        datos.prioridadId,
        datos.resultadoId
      ]
    );
    if (result.rowCount === 0) {
      throw new RecursoNoEncontradoError('Solicitud', id);
    }
  }

  async borrarLogico(id: number): Promise<void> {
    const result = await this.pool.query(
      `UPDATE solicitud SET activo = FALSE, actualizado_en = now()
       WHERE id = $1 AND activo = TRUE`,
      [id]
    );
    if (result.rowCount === 0) {
      throw new RecursoNoEncontradoError('Solicitud', id);
    }
  }
}

function mapRow(row: SolicitudRow): SolicitudResponse {
  return {
    id: row.id,
    titulo: row.titulo,
    descripcion: row.descripcion,
    observaciones: row.observaciones,
    tipoTecnico: { id: row.tipo_tecnico_id, nombre: row.tipo_tecnico_nombre },
    tipoServicio: { id: row.tipo_servicio_id, nombre: row.tipo_servicio_nombre },
    tecnico: row.tecnico_id
      ? { id: row.tecnico_id, nombre: row.tecnico_nombre ?? '' }
      : null,
    objeto: { id: row.objeto_id, nombre: row.objeto_nombre },
    estado: {
      id: row.estado_id,
      nombre: row.estado_nombre,
      codigo: row.estado_codigo
    },
    prioridad: {
      id: row.prioridad_id,
      nombre: row.prioridad_nombre,
      codigo: row.prioridad_codigo
    },
    resultado: row.resultado_id
      ? {
          id: row.resultado_id,
          nombre: row.resultado_nombre ?? '',
          codigo: row.resultado_codigo ?? undefined
        }
      : null,
    creadoEn: row.creado_en.toISOString(),
    actualizadoEn: row.actualizado_en.toISOString()
  };
}
