-- Reset local del esquema (desarrollo). No usar en producción.
-- Equivalente a borrar y recrear el schema public de asigna_tech_db.

DROP TABLE IF EXISTS solicitud CASCADE;
DROP TABLE IF EXISTS tecnico CASCADE;
DROP TABLE IF EXISTS tipo_servicio CASCADE;
DROP TABLE IF EXISTS objeto CASCADE;
DROP TABLE IF EXISTS tipo_tecnico CASCADE;
DROP TABLE IF EXISTS estado_solicitud CASCADE;
DROP TABLE IF EXISTS prioridad CASCADE;
DROP TABLE IF EXISTS resultado_solicitud CASCADE;
