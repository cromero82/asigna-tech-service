import { JsonObject } from 'swagger-ui-express';

const idEntero = { type: 'integer', minimum: 1 };
const idOpcional = { type: 'integer', minimum: 1, nullable: true };

const errorRespuesta = {
  type: 'object',
  required: ['status', 'message'],
  properties: {
    status: { type: 'integer', example: 400 },
    message: { type: 'string', example: 'titulo es obligatorio' }
  }
};

const jsonError = (description: string, example: string, status: number) => ({
  description,
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/ErrorRespuesta' },
      example: { status, message: example }
    }
  }
});

const idPath = {
  name: 'id',
  in: 'path',
  required: true,
  schema: idEntero,
  description: 'Identificador numérico'
};

const filtroEspecialidad = {
  name: 'tipoTecnicoId',
  in: 'query',
  required: false,
  schema: idEntero,
  description: 'Filtra por especialidad'
};

function crudCatalogo(opciones: {
  tag: string;
  descripcionLista: string;
  descripcionAlta: string;
  schema: string;
  body: string;
  ejemplo: Record<string, unknown>;
  filtro?: boolean;
}): JsonObject {
  const get: JsonObject = {
    tags: [opciones.tag],
    summary: opciones.descripcionLista,
    parameters: opciones.filtro ? [filtroEspecialidad] : [],
    responses: {
      200: {
        description: 'Listado de registros activos',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: { $ref: `#/components/schemas/${opciones.schema}` }
            }
          }
        }
      },
      400: { $ref: '#/components/responses/Error400' },
      500: { $ref: '#/components/responses/Error500' }
    }
  };
  const post: JsonObject = {
    tags: [opciones.tag],
    summary: opciones.descripcionAlta,
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: `#/components/schemas/${opciones.body}` },
          example: opciones.ejemplo
        }
      }
    },
    responses: {
      201: {
        description: 'Creado',
        content: {
          'application/json': {
            schema: { $ref: `#/components/schemas/${opciones.schema}` }
          }
        }
      },
      400: { $ref: '#/components/responses/Error400' },
      500: { $ref: '#/components/responses/Error500' }
    }
  };
  const put: JsonObject = {
    tags: [opciones.tag],
    summary: 'Actualizar',
    parameters: [idPath],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: `#/components/schemas/${opciones.body}` },
          example: opciones.ejemplo
        }
      }
    },
    responses: {
      200: {
        description: 'Actualizado',
        content: {
          'application/json': {
            schema: { $ref: `#/components/schemas/${opciones.schema}` }
          }
        }
      },
      400: { $ref: '#/components/responses/Error400' },
      404: { $ref: '#/components/responses/Error404' },
      500: { $ref: '#/components/responses/Error500' }
    }
  };
  const del: JsonObject = {
    tags: [opciones.tag],
    summary: 'Borrado lógico',
    parameters: [idPath],
    responses: {
      204: { description: 'Inactivado' },
      400: { $ref: '#/components/responses/Error400' },
      404: { $ref: '#/components/responses/Error404' },
      500: { $ref: '#/components/responses/Error500' }
    }
  };
  return { get, post, put, del };
}

const especialidades = crudCatalogo({
  tag: 'Especialidades',
  descripcionLista: 'Listar especialidades activas',
  descripcionAlta: 'Crear especialidad',
  schema: 'CatalogoItem',
  body: 'CrearEspecialidad',
  ejemplo: { nombre: 'Impresoras 3D', descripcion: null }
});

const tiposServicio = crudCatalogo({
  tag: 'Tipos de servicio',
  descripcionLista: 'Listar tipos de servicio activos',
  descripcionAlta: 'Crear tipo de servicio',
  schema: 'TipoServicio',
  body: 'CrearTipoServicio',
  ejemplo: { nombre: 'Limpieza de ventiladores', tipoTecnicoId: 2, descripcion: null },
  filtro: true
});

const tecnicos = crudCatalogo({
  tag: 'Técnicos',
  descripcionLista: 'Listar técnicos activos',
  descripcionAlta: 'Crear técnico',
  schema: 'Tecnico',
  body: 'CrearTecnico',
  ejemplo: {
    nombre: 'Sofía Mora',
    correo: 'sofia.mora@example.com',
    tipoTecnicoId: 5
  },
  filtro: true
});

const objetos = crudCatalogo({
  tag: 'Objetos',
  descripcionLista: 'Listar objetos activos',
  descripcionAlta: 'Crear objeto',
  schema: 'CatalogoItem',
  body: 'CrearObjeto',
  ejemplo: { nombre: 'Proyector sala 2' }
});

export const openapiDocument: JsonObject = {
  openapi: '3.0.3',
  info: {
    title: 'Asigna Tech API',
    version: '1.0.0',
    description: [
      'CRUD de solicitudes de asignación a técnicos TI.',
      '',
      'Códigos: **400** input, **404** no encontrado, **412** regla de dominio, **500** no controlado.',
      'DELETE es borrado lógico (`activo = false`).',
      '',
      'Reglas al crear/editar solicitud:',
      '- Sin técnico → estado `PENDIENTE`.',
      '- Con técnico → no puede quedar `PENDIENTE` (mínimo `ASIGNADA`).',
      '- Técnico y tipo de servicio deben ser de la misma especialidad.',
      '- `resultadoId` solo si el estado es `CERRADA`.'
    ].join('\n')
  },
  servers: [{ url: 'http://localhost:3000', description: 'Local' }],
  tags: [
    { name: 'Salud', description: 'Equivalente a Actuator /health y métricas básicas' },
    { name: 'Solicitudes', description: 'CRUD de solicitudes' },
    { name: 'Servicios', description: 'Árbol especialidad → tipo de servicio' },
    { name: 'Especialidades' },
    { name: 'Tipos de servicio' },
    { name: 'Técnicos' },
    { name: 'Objetos' },
    { name: 'Catálogos de solicitud', description: 'Estados, prioridades y resultados (solo lectura)' }
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Salud'],
        summary: 'Estado del servicio y de PostgreSQL',
        responses: {
          200: {
            description: 'Servicio y base arriba',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Health' },
                example: {
                  status: 'UP',
                  database: 'UP',
                  uptimeSeconds: 12,
                  environment: 'development'
                }
              }
            }
          },
          503: {
            description: 'Base no disponible',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Health' },
                example: { status: 'DOWN', database: 'DOWN' }
              }
            }
          }
        }
      }
    },
    '/metrics': {
      get: {
        tags: ['Salud'],
        summary: 'Contadores HTTP en memoria (equivalente liviano a Micrometer)',
        responses: {
          200: {
            description: 'Métricas del proceso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Metrics' }
              }
            }
          }
        }
      }
    },
    '/api/solicitudes': {
      get: {
        tags: ['Solicitudes'],
        summary: 'Listar solicitudes activas',
        responses: {
          200: {
            description: 'Listado',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Solicitud' }
                }
              }
            }
          },
          500: { $ref: '#/components/responses/Error500' }
        }
      },
      post: {
        tags: ['Solicitudes'],
        summary: 'Crear solicitud',
        description:
          'Sin `tecnicoId` el estado queda `PENDIENTE`. Con técnico y sin estado, `ASIGNADA`. Prioridad por defecto `MEDIA`.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CrearSolicitud' },
              example: {
                titulo: 'Revisar encendido de Laptop',
                descripcion: 'No enciende en sala informática',
                observaciones: null,
                tipoTecnicoId: 2,
                tipoServicioId: 6,
                tecnicoId: null,
                objetoId: 3
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Creada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Solicitud' }
              }
            }
          },
          400: { $ref: '#/components/responses/Error400' },
          412: { $ref: '#/components/responses/Error412' },
          500: { $ref: '#/components/responses/Error500' }
        }
      }
    },
    '/api/solicitudes/{id}': {
      get: {
        tags: ['Solicitudes'],
        summary: 'Obtener solicitud por id',
        parameters: [idPath],
        responses: {
          200: {
            description: 'Encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Solicitud' }
              }
            }
          },
          400: { $ref: '#/components/responses/Error400' },
          404: { $ref: '#/components/responses/Error404' },
          500: { $ref: '#/components/responses/Error500' }
        }
      },
      put: {
        tags: ['Solicitudes'],
        summary: 'Actualizar solicitud',
        parameters: [idPath],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ActualizarSolicitud' },
              example: {
                titulo: 'Revisar encendido de Laptop',
                descripcion: 'No enciende',
                observaciones: 'Asignar a Pedro',
                tipoTecnicoId: 2,
                tipoServicioId: 6,
                tecnicoId: 1,
                objetoId: 3,
                estadoId: 2,
                prioridadId: 2,
                resultadoId: null
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Actualizada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Solicitud' }
              }
            }
          },
          400: { $ref: '#/components/responses/Error400' },
          404: { $ref: '#/components/responses/Error404' },
          412: { $ref: '#/components/responses/Error412' },
          500: { $ref: '#/components/responses/Error500' }
        }
      },
      delete: {
        tags: ['Solicitudes'],
        summary: 'Borrado lógico',
        parameters: [idPath],
        responses: {
          204: { description: 'Inactivada' },
          400: { $ref: '#/components/responses/Error400' },
          404: { $ref: '#/components/responses/Error404' },
          500: { $ref: '#/components/responses/Error500' }
        }
      }
    },
    '/api/servicios': {
      get: {
        tags: ['Servicios'],
        summary: 'Árbol especialidad → tipos de servicio',
        responses: {
          200: {
            description: 'Grupos activos',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/ServicioGrupo' }
                }
              }
            }
          },
          500: { $ref: '#/components/responses/Error500' }
        }
      }
    },
    '/api/tipos-tecnico': {
      get: especialidades.get,
      post: especialidades.post
    },
    '/api/tipos-tecnico/{id}': {
      put: especialidades.put,
      delete: especialidades.del
    },
    '/api/tipos-servicio': {
      get: tiposServicio.get,
      post: tiposServicio.post
    },
    '/api/tipos-servicio/{id}': {
      put: tiposServicio.put,
      delete: tiposServicio.del
    },
    '/api/tecnicos': {
      get: tecnicos.get,
      post: tecnicos.post
    },
    '/api/tecnicos/{id}': {
      put: tecnicos.put,
      delete: tecnicos.del
    },
    '/api/objetos': {
      get: objetos.get,
      post: objetos.post
    },
    '/api/objetos/{id}': {
      put: objetos.put,
      delete: objetos.del
    },
    '/api/estados-solicitud': catalogoSoloLectura('Estados de solicitud'),
    '/api/prioridades': catalogoSoloLectura('Prioridades'),
    '/api/resultados-solicitud': catalogoSoloLectura('Resultados')
  },
  components: {
    schemas: {
      ErrorRespuesta: errorRespuesta,
      Health: {
        type: 'object',
        required: ['status', 'database'],
        properties: {
          status: { type: 'string', enum: ['UP', 'DOWN'] },
          database: { type: 'string', enum: ['UP', 'DOWN'] },
          uptimeSeconds: { type: 'integer', minimum: 0 },
          environment: { type: 'string', example: 'development' }
        }
      },
      Metrics: {
        type: 'object',
        required: ['uptimeSeconds', 'httpRequestsTotal', 'httpRequestsByStatus'],
        properties: {
          uptimeSeconds: { type: 'integer', minimum: 0 },
          httpRequestsTotal: { type: 'integer', minimum: 0 },
          httpRequestsByStatus: {
            type: 'object',
            additionalProperties: { type: 'integer' },
            example: { '200': 4 }
          }
        }
      },
      CatalogoRef: {
        type: 'object',
        required: ['id', 'nombre'],
        properties: {
          id: idEntero,
          nombre: { type: 'string' },
          codigo: { type: 'string' }
        }
      },
      CatalogoItem: {
        type: 'object',
        required: ['id', 'nombre'],
        properties: {
          id: idEntero,
          nombre: { type: 'string' }
        }
      },
      EstadoPrioridadResultado: {
        type: 'object',
        required: ['id', 'codigo', 'nombre'],
        properties: {
          id: idEntero,
          codigo: { type: 'string', example: 'PENDIENTE' },
          nombre: { type: 'string', example: 'Pendiente' }
        }
      },
      TipoServicio: {
        type: 'object',
        required: ['id', 'nombre', 'tipoTecnicoId'],
        properties: {
          id: idEntero,
          nombre: { type: 'string' },
          tipoTecnicoId: idEntero
        }
      },
      Tecnico: {
        type: 'object',
        required: ['id', 'nombre', 'correo', 'tipoTecnicoId'],
        properties: {
          id: idEntero,
          nombre: { type: 'string' },
          correo: { type: 'string', nullable: true },
          tipoTecnicoId: idEntero
        }
      },
      ServicioGrupo: {
        type: 'object',
        required: ['id', 'nombre', 'tiposServicio'],
        properties: {
          id: idEntero,
          nombre: { type: 'string', example: 'Laptops (Portátiles) y computadores' },
          tiposServicio: {
            type: 'array',
            items: { $ref: '#/components/schemas/TipoServicio' }
          }
        }
      },
      Solicitud: {
        type: 'object',
        required: [
          'id',
          'titulo',
          'descripcion',
          'observaciones',
          'tipoTecnico',
          'tipoServicio',
          'tecnico',
          'objeto',
          'estado',
          'prioridad',
          'resultado',
          'creadoEn',
          'actualizadoEn'
        ],
        properties: {
          id: idEntero,
          titulo: { type: 'string' },
          descripcion: { type: 'string', nullable: true },
          observaciones: { type: 'string', nullable: true },
          tipoTecnico: { $ref: '#/components/schemas/CatalogoRef' },
          tipoServicio: { $ref: '#/components/schemas/CatalogoRef' },
          tecnico: { allOf: [{ $ref: '#/components/schemas/CatalogoRef' }], nullable: true },
          objeto: { allOf: [{ $ref: '#/components/schemas/CatalogoRef' }], nullable: true },
          estado: { $ref: '#/components/schemas/CatalogoRef' },
          prioridad: { $ref: '#/components/schemas/CatalogoRef' },
          resultado: { allOf: [{ $ref: '#/components/schemas/CatalogoRef' }], nullable: true },
          creadoEn: { type: 'string', format: 'date-time' },
          actualizadoEn: { type: 'string', format: 'date-time' }
        }
      },
      CrearSolicitud: {
        type: 'object',
        required: ['titulo', 'tipoTecnicoId', 'tipoServicioId'],
        properties: {
          titulo: { type: 'string', minLength: 1, maxLength: 160 },
          descripcion: { type: 'string', nullable: true, maxLength: 4000 },
          observaciones: { type: 'string', nullable: true, maxLength: 4000 },
          tipoTecnicoId: idEntero,
          tipoServicioId: idEntero,
          tecnicoId: idOpcional,
          objetoId: idOpcional,
          estadoId: idOpcional,
          prioridadId: idOpcional,
          resultadoId: idOpcional
        }
      },
      ActualizarSolicitud: {
        type: 'object',
        required: ['titulo', 'tipoTecnicoId', 'tipoServicioId', 'estadoId', 'prioridadId'],
        properties: {
          titulo: { type: 'string', minLength: 1, maxLength: 160 },
          descripcion: { type: 'string', nullable: true, maxLength: 4000 },
          observaciones: { type: 'string', nullable: true, maxLength: 4000 },
          tipoTecnicoId: idEntero,
          tipoServicioId: idEntero,
          tecnicoId: idOpcional,
          objetoId: idOpcional,
          estadoId: idEntero,
          prioridadId: idEntero,
          resultadoId: idOpcional
        }
      },
      CrearEspecialidad: {
        type: 'object',
        required: ['nombre'],
        properties: {
          nombre: { type: 'string', minLength: 1, maxLength: 160 },
          descripcion: { type: 'string', nullable: true }
        }
      },
      CrearTipoServicio: {
        type: 'object',
        required: ['nombre', 'tipoTecnicoId'],
        properties: {
          nombre: { type: 'string', minLength: 1, maxLength: 160 },
          descripcion: { type: 'string', nullable: true },
          tipoTecnicoId: idEntero
        }
      },
      CrearTecnico: {
        type: 'object',
        required: ['nombre', 'tipoTecnicoId'],
        properties: {
          nombre: { type: 'string', minLength: 1 },
          correo: { type: 'string', nullable: true },
          tipoTecnicoId: idEntero
        }
      },
      CrearObjeto: {
        type: 'object',
        required: ['nombre'],
        properties: {
          nombre: { type: 'string', minLength: 1 }
        }
      }
    },
    responses: {
      Error400: jsonError('Validación de input o catálogo', 'titulo es obligatorio', 400),
      Error404: jsonError('Recurso no encontrado o inactivo', 'Solicitud 99 no existe', 404),
      Error412: jsonError(
        'Regla de dominio',
        'El técnico debe ser de la misma especialidad que el servicio',
        412
      ),
      Error500: jsonError('Error no controlado', 'Error interno del servidor', 500)
    }
  }
};

function catalogoSoloLectura(summary: string): JsonObject {
  return {
    get: {
      tags: ['Catálogos de solicitud'],
      summary,
      responses: {
        200: {
          description: 'Listado activo',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/EstadoPrioridadResultado' }
              }
            }
          }
        },
        500: { $ref: '#/components/responses/Error500' }
      }
    }
  };
}
