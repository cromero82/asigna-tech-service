-- Datos iniciales Asigna Tech (Hito 1 + catálogo de servicios)
-- Los INSERT resuelven FKs por nombre, no por id mágico.
-- tipo_servicio permite el mismo nombre en distintas especialidades (UNIQUE nombre + tipo_tecnico_id).

INSERT INTO tipo_tecnico (nombre, descripcion) VALUES
    ('Impresoras', 'Mantenimiento e instalación de impresoras'),
    ('Laptops (Portátiles) y computadores', 'Equipos de cómputo y software'),
    ('Android', 'Dispositivos Android'),
    ('iOS', 'Dispositivos iOS'),
    ('Redes', 'Conectividad LAN/WAN'),
    ('Telefonía IP', 'Centrales y extensiones IP'),
    ('Videovigilancia', 'CCTV y DVR');

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
SELECT v.nombre, v.descripcion, t.id
FROM tipo_tecnico t
JOIN (VALUES
    ('Impresoras', 'Mantenimiento', 'Mantenimiento preventivo o correctivo'),
    ('Impresoras', 'Instalación', 'Instalación de impresora'),
    ('Impresoras', 'Cambio de tóner', 'Reemplazo de consumible'),
    ('Laptops (Portátiles) y computadores', 'Instalación de software', 'Instalación o actualización de software'),
    ('Laptops (Portátiles) y computadores', 'Revisión de encendido', 'Diagnóstico de encendido de equipo'),
    ('Laptops (Portátiles) y computadores', 'Mantenimiento', 'Mantenimiento de equipo de cómputo'),
    ('Android', 'Mantenimiento', 'Mantenimiento de dispositivo Android'),
    ('Android', 'Instalación de apps', 'Instalación o configuración de aplicaciones'),
    ('Android', 'Cambio de pantalla', 'Reparación de display'),
    ('iOS', 'Mantenimiento', 'Mantenimiento de dispositivo iOS'),
    ('iOS', 'Actualización iOS', 'Actualización del sistema'),
    ('iOS', 'Diagnóstico de batería', 'Revisión de salud de batería'),
    ('Redes', 'Cableado estructurado', 'Tendido y certificación de cableado'),
    ('Redes', 'Configuración de switch', 'Configuración de equipo de red'),
    ('Redes', 'Diagnóstico de red', 'Análisis de conectividad'),
    ('Telefonía IP', 'Alta de extensión', 'Creación de extensión en centralita'),
    ('Telefonía IP', 'Configuración de centralita', 'Ajustes de PBX IP'),
    ('Videovigilancia', 'Instalación de cámaras', 'Montaje de cámaras CCTV'),
    ('Videovigilancia', 'Revisión de DVR', 'Diagnóstico de grabador')
) AS v(especialidad, nombre, descripcion)
  ON t.nombre = v.especialidad;

INSERT INTO tecnico (nombre, correo, tipo_tecnico_id)
SELECT v.nombre, v.correo, t.id
FROM tipo_tecnico t
JOIN (VALUES
    ('Pedro Pérez', 'pedro.perez@example.com', 'Laptops (Portátiles) y computadores'),
    ('Ana López', 'ana.lopez@example.com', 'Impresoras'),
    ('Juan García', 'juan.garcia@example.com', 'Impresoras'),
    ('Luis Romero', 'luis.romero@example.com', 'Android'),
    ('Marta Díaz', 'marta.diaz@example.com', 'iOS'),
    ('Carlos Vega', 'carlos.vega@example.com', 'Redes'),
    ('Elena Ruiz', 'elena.ruiz@example.com', 'Telefonía IP'),
    ('Diego Soto', 'diego.soto@example.com', 'Videovigilancia')
) AS v(nombre, correo, especialidad)
  ON t.nombre = v.especialidad;
