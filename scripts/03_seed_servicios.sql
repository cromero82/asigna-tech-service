-- Permite el mismo nombre de tipo de servicio en distintas especialidades.
ALTER TABLE tipo_servicio DROP CONSTRAINT IF EXISTS tipo_servicio_nombre_key;
ALTER TABLE tipo_servicio DROP CONSTRAINT IF EXISTS uq_tipo_servicio_nombre_especialidad;
ALTER TABLE tipo_servicio
    ADD CONSTRAINT uq_tipo_servicio_nombre_especialidad UNIQUE (nombre, tipo_tecnico_id);

UPDATE tipo_tecnico SET nombre = 'Impresoras', descripcion = 'Mantenimiento e instalación de impresoras', actualizado_en = now()
WHERE nombre = 'Técnico en Impresoras';
UPDATE tipo_tecnico SET nombre = 'Laptops (Portátiles) y computadores', descripcion = 'Equipos de cómputo y software', actualizado_en = now()
WHERE nombre IN ('Técnico en sistemas', 'sistemas');
UPDATE tipo_tecnico SET nombre = 'Android', descripcion = 'Dispositivos Android', actualizado_en = now()
WHERE nombre IN ('Técnico android', 'Técnico Android');
UPDATE tipo_tecnico SET nombre = 'iOS', descripcion = 'Dispositivos iOS', actualizado_en = now()
WHERE nombre IN ('Técnico iPhone', 'Técnico iOS', 'iPhone');
UPDATE tipo_tecnico SET nombre = 'Redes', descripcion = 'Conectividad LAN/WAN', actualizado_en = now()
WHERE nombre = 'Técnico en redes';
UPDATE tipo_tecnico SET nombre = 'Telefonía IP', descripcion = 'Centrales y extensiones IP', actualizado_en = now()
WHERE nombre IN ('Técnico en telefonía IP', 'Técnico en Telefonia IP');
UPDATE tipo_tecnico SET nombre = 'Videovigilancia', descripcion = 'CCTV y DVR', actualizado_en = now()
WHERE nombre = 'Técnico en videovigilancia';

-- Alinea el seed inicial (nombres únicos globales) con el catálogo agrupado.
UPDATE tipo_servicio ts
SET nombre = 'Mantenimiento',
    descripcion = 'Mantenimiento preventivo o correctivo'
FROM tipo_tecnico t
WHERE ts.tipo_tecnico_id = t.id
  AND t.nombre = 'Impresoras'
  AND ts.nombre = 'Mantenimiento Impresora';

UPDATE tipo_servicio ts
SET nombre = 'Instalación de software',
    descripcion = 'Instalación o actualización de software'
FROM tipo_tecnico t
WHERE ts.tipo_tecnico_id = t.id
  AND t.nombre = 'Laptops (Portátiles) y computadores'
  AND ts.nombre = 'Instalación de Software';

UPDATE tipo_servicio ts
SET nombre = 'Revisión de encendido',
    descripcion = 'Diagnóstico de encendido de equipo'
FROM tipo_tecnico t
WHERE ts.tipo_tecnico_id = t.id
  AND t.nombre = 'Laptops (Portátiles) y computadores'
  AND ts.nombre = 'Revisar encendido de Laptop';

INSERT INTO tipo_tecnico (nombre, descripcion)
SELECT v.nombre, v.descripcion
FROM (VALUES
    ('Redes', 'Conectividad LAN/WAN'),
    ('Telefonía IP', 'Centrales y extensiones IP'),
    ('Videovigilancia', 'CCTV y DVR')
) AS v(nombre, descripcion)
WHERE NOT EXISTS (SELECT 1 FROM tipo_tecnico t WHERE t.nombre = v.nombre);

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
  ON t.nombre = v.especialidad
WHERE NOT EXISTS (
    SELECT 1
    FROM tipo_servicio ts
    WHERE ts.nombre = v.nombre AND ts.tipo_tecnico_id = t.id
);

INSERT INTO tecnico (nombre, correo, tipo_tecnico_id)
SELECT v.nombre, v.correo, t.id
FROM tipo_tecnico t
JOIN (VALUES
    ('Luis Romero', 'luis.romero@example.com', 'Android'),
    ('Marta Díaz', 'marta.diaz@example.com', 'iOS'),
    ('Carlos Vega', 'carlos.vega@example.com', 'Redes'),
    ('Elena Ruiz', 'elena.ruiz@example.com', 'Telefonía IP'),
    ('Diego Soto', 'diego.soto@example.com', 'Videovigilancia')
) AS v(nombre, correo, especialidad)
  ON t.nombre = v.especialidad
WHERE NOT EXISTS (SELECT 1 FROM tecnico tec WHERE tec.correo = v.correo);
