-- objeto deja de ser obligatorio en solicitud.
ALTER TABLE solicitud ALTER COLUMN objeto_id DROP NOT NULL;
