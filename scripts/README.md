# Scripts de modelo de datos

Entregable de la prueba: creación del modelo relacional. Equivalente a `ddl-auto=none` en Spring: el SQL es la fuente de verdad, no un ORM.

Base destino: `asigna_tech_db` (usuario `romax-admin`). Password solo por variable de entorno, nunca en git.

## Crear esquema y seeds (BD vacía)

Desde la raíz de `asigna-tech-service`:

```bash
PGPASSWORD='***' psql -h localhost -p 5432 -U romax-admin -d asigna_tech_db -f scripts/01_create_schema.sql
PGPASSWORD='***' psql -h localhost -p 5432 -U romax-admin -d asigna_tech_db -f scripts/02_seed.sql
```

## Recrear desde cero (desarrollo local)

```bash
PGPASSWORD='***' psql -h localhost -p 5432 -U romax-admin -d asigna_tech_db -f scripts/00_drop_schema.sql
PGPASSWORD='***' psql -h localhost -p 5432 -U romax-admin -d asigna_tech_db -f scripts/01_create_schema.sql
PGPASSWORD='***' psql -h localhost -p 5432 -U romax-admin -d asigna_tech_db -f scripts/02_seed.sql
```

## Ampliar catálogo de servicios (BD ya creada)

Cambia el UNIQUE de `tipo_servicio` a `(nombre, tipo_tecnico_id)` e inserta especialidades y tipos faltantes:

```bash
PGPASSWORD='***' psql -h localhost -p 5432 -U romax-admin -d asigna_tech_db -f scripts/03_seed_servicios.sql
```

## Renombrar especialidades (BD ya creada)

Quita el prefijo `Técnico en…` (`Impresoras`, `Android`, `iOS`, …):

```bash
PGPASSWORD='***' psql -h localhost -p 5432 -U romax-admin -d asigna_tech_db -f scripts/04_rename_especialidades.sql
```

## Objeto opcional en solicitud (BD ya creada)

```bash
PGPASSWORD='***' psql -h localhost -p 5432 -U romax-admin -d asigna_tech_db -f scripts/05_objeto_opcional.sql
```

## Verificar

```bash
PGPASSWORD='***' psql -h localhost -p 5432 -U romax-admin -d asigna_tech_db -c '\dt'
```

Tablas esperadas: `tipo_tecnico`, `tecnico`, `tipo_servicio`, `objeto`, `estado_solicitud`, `prioridad`, `resultado_solicitud`, `solicitud`.
