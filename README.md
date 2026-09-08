# asigna-tech-service

API REST de asignación de solicitudes a técnicos TI. Express + TypeScript + PostgreSQL (`pg`). El esquema lo crean los scripts SQL (`ddl-auto=none`), no el servidor.

Requisito: **Node.js 24+**. En esta máquina se verificó con `node -v`.

## Arranque local (equivalente a `spring-boot:run`)

```bash
cd asigna-tech-service
node -v
cp .env.example .env
```

Editar `.env` con el password de Postgres (ese archivo no va a git). Equivale a `application.properties` + secretos fuera del repo.

```bash
npm install
npm run start:dev
```

Producción local (compilar):

```bash
npm run build
npm start
```

Health (Actuator): `GET http://localhost:3000/health`  
Métricas: `GET http://localhost:3000/metrics`  
Swagger: `http://localhost:3000/swagger-ui`

CRUD solicitudes: `GET|POST /api/solicitudes`, `GET|PUT|DELETE /api/solicitudes/:id` (ver `http/solicitudes.http`).

## Tests

```bash
npm test
npm run test:coverage
```

## Modelo de datos

Ver `scripts/README.md`.
