-- Datos iniciales Asigna Tech (Hito 1)
-- Los INSERT de catálogo y técnicos resuelven FKs por nombre, no por id mágico.
-- No se siembran solicitudes: el CRUD las crea (Hito 3).

INSERT INTO tipo_tecnico (nombre, descripcion) VALUES
    ('Técnico en Impresoras', 'Especialidad en mantenimiento e instalación de impresoras'),
    ('Técnico en sistemas', 'Especialidad en equipos de cómputo y software'),
    ('Técnico android', 'Especialidad en dispositivos Android'),
    ('Técnico iPhone', 'Especialidad en dispositivos iPhone');

INSERT INTO estado_solicitud (codigo, nombre) VALUES
    ('PENDIENTE', 'Pendiente'),
    ('ASIGNADA', 'Asignada'),
    ('EN_PROGRESO', 'En progreso'),
    ('CERRADA', 'Cerrada');

INSERT INTO prioridad (codigo, nombre, orden) VALUES
    ('ALTA', 'Alta', 1),
    ('MEDIA', 'Media', 2),
    ('BAJA', 'Baja', 3);

INSERT INTO resultado_solicitud (codigo, nombre) VALUES
    ('EXITOSA', 'Exitosa'),
    ('NO_EXITOSA', 'No exitosa');

INSERT INTO objeto (nombre) VALUES
    ('Dell Inspiron 5036'),
    ('Impresora HP DESK Jet 1234'),
    ('Laptops sala informática');

INSERT INTO tipo_servicio (nombre, descripcion, tipo_tecnico_id)
SELECT 'Mantenimiento Impresora', 'Mantenimiento preventivo o correctivo de impresora', id
FROM tipo_tecnico WHERE nombre = 'Técnico en Impresoras';

INSERT INTO tipo_servicio (nombre, descripcion, tipo_tecnico_id)
SELECT 'Instalación de Software', 'Instalación o actualización de software', id
FROM tipo_tecnico WHERE nombre = 'Técnico en sistemas';

INSERT INTO tipo_servicio (nombre, descripcion, tipo_tecnico_id)
SELECT 'Revisar encendido de Laptop', 'Diagnóstico de encendido de equipo portátil', id
FROM tipo_tecnico WHERE nombre = 'Técnico en sistemas';

INSERT INTO tecnico (nombre, correo, tipo_tecnico_id)
SELECT 'Pedro Pérez', 'pedro.perez@example.com', id
FROM tipo_tecnico WHERE nombre = 'Técnico en sistemas';

INSERT INTO tecnico (nombre, correo, tipo_tecnico_id)
SELECT 'Ana López', 'ana.lopez@example.com', id
FROM tipo_tecnico WHERE nombre = 'Técnico en Impresoras';

INSERT INTO tecnico (nombre, correo, tipo_tecnico_id)
SELECT 'Juan García', 'juan.garcia@example.com', id
FROM tipo_tecnico WHERE nombre = 'Técnico en Impresoras';
