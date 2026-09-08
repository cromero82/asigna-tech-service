-- Esquema relacional Asigna Tech (Hito 1)
-- Equivalente a ddl-auto=none: este archivo es la fuente de verdad del modelo.
-- Base: asigna_tech_db
--
-- Orden: catálogos sin FK → catálogos con FK → solicitud.
-- FKs: ON UPDATE CASCADE, ON DELETE RESTRICT (no borrar catálogo si hay solicitudes).
-- Borrado de negocio: columna activo (lógico). No usar DELETE FROM en la API.

CREATE TABLE tipo_tecnico (
    id              SERIAL PRIMARY KEY,
    nombre          VARCHAR(120) NOT NULL UNIQUE,
    descripcion     VARCHAR(255),
    activo          BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en       TIMESTAMPTZ NOT NULL DEFAULT now(),
    actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE estado_solicitud (
    id      SERIAL PRIMARY KEY,
    codigo  VARCHAR(30) NOT NULL UNIQUE,
    nombre  VARCHAR(60) NOT NULL,
    activo  BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE prioridad (
    id      SERIAL PRIMARY KEY,
    codigo  VARCHAR(30) NOT NULL UNIQUE,
    nombre  VARCHAR(60) NOT NULL,
    orden   INT NOT NULL,
    activo  BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE resultado_solicitud (
    id      SERIAL PRIMARY KEY,
    codigo  VARCHAR(30) NOT NULL UNIQUE,
    nombre  VARCHAR(60) NOT NULL,
    activo  BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE objeto (
    id              SERIAL PRIMARY KEY,
    nombre          VARCHAR(160) NOT NULL UNIQUE,
    activo          BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en       TIMESTAMPTZ NOT NULL DEFAULT now(),
    actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE tecnico (
    id              SERIAL PRIMARY KEY,
    nombre          VARCHAR(120) NOT NULL,
    correo          VARCHAR(180) UNIQUE,
    tipo_tecnico_id INT NOT NULL,
    activo          BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en       TIMESTAMPTZ NOT NULL DEFAULT now(),
    actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_tecnico_tipo_tecnico
        FOREIGN KEY (tipo_tecnico_id) REFERENCES tipo_tecnico (id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE tipo_servicio (
    id              SERIAL PRIMARY KEY,
    nombre          VARCHAR(120) NOT NULL UNIQUE,
    descripcion     VARCHAR(255),
    tipo_tecnico_id INT NOT NULL,
    activo          BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en       TIMESTAMPTZ NOT NULL DEFAULT now(),
    actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_tipo_servicio_tipo_tecnico
        FOREIGN KEY (tipo_tecnico_id) REFERENCES tipo_tecnico (id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- tecnico_id nullable: solicitud sin asignar (estado PENDIENTE).
-- resultado_id nullable: solo al cerrar (CERRADA).
CREATE TABLE solicitud (
    id               SERIAL PRIMARY KEY,
    titulo           VARCHAR(160) NOT NULL,
    descripcion      TEXT,
    observaciones    TEXT,
    tipo_tecnico_id  INT NOT NULL,
    tipo_servicio_id INT NOT NULL,
    tecnico_id       INT,
    objeto_id        INT NOT NULL,
    estado_id        INT NOT NULL,
    prioridad_id     INT NOT NULL,
    resultado_id     INT,
    activo           BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en        TIMESTAMPTZ NOT NULL DEFAULT now(),
    actualizado_en   TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_solicitud_tipo_tecnico
        FOREIGN KEY (tipo_tecnico_id) REFERENCES tipo_tecnico (id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_solicitud_tipo_servicio
        FOREIGN KEY (tipo_servicio_id) REFERENCES tipo_servicio (id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_solicitud_tecnico
        FOREIGN KEY (tecnico_id) REFERENCES tecnico (id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_solicitud_objeto
        FOREIGN KEY (objeto_id) REFERENCES objeto (id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_solicitud_estado
        FOREIGN KEY (estado_id) REFERENCES estado_solicitud (id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_solicitud_prioridad
        FOREIGN KEY (prioridad_id) REFERENCES prioridad (id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_solicitud_resultado
        FOREIGN KEY (resultado_id) REFERENCES resultado_solicitud (id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX idx_tecnico_tipo_tecnico_id ON tecnico (tipo_tecnico_id);
CREATE INDEX idx_tipo_servicio_tipo_tecnico_id ON tipo_servicio (tipo_tecnico_id);
CREATE INDEX idx_solicitud_tipo_tecnico_id ON solicitud (tipo_tecnico_id);
CREATE INDEX idx_solicitud_tipo_servicio_id ON solicitud (tipo_servicio_id);
CREATE INDEX idx_solicitud_tecnico_id ON solicitud (tecnico_id);
CREATE INDEX idx_solicitud_objeto_id ON solicitud (objeto_id);
CREATE INDEX idx_solicitud_estado_id ON solicitud (estado_id);
CREATE INDEX idx_solicitud_prioridad_id ON solicitud (prioridad_id);
CREATE INDEX idx_solicitud_activo ON solicitud (activo);
