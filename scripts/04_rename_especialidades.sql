-- Quita el prefijo "Técnico en…" de las especialidades (tipo_tecnico).
-- Idempotente: solo actualiza si todavía existe el nombre anterior.

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
