# asigna-tech-service

API REST de asignación de solicitudes a técnicos TI. Express + TypeScript + PostgreSQL (`pg`). El esquema lo crean los scripts SQL (`ddl-auto=none`), no el servidor.

Requisito: **Node.js 24+**. En esta máquina se verificó con `node -v`.

## Arranque local (equivalente a `spring-boot:run`)

```bash
cd asigna-tech-service
node -v
cp src/config/secrets.local.example.ts src/config/secrets.local.ts
```

Editar `src/config/secrets.local.ts` con el password de Postgres (ese archivo no va a git).

```bash
npm install
npm run start:dev
```

Producción local (compilar):

```bash
npm run build
npm start
```

Health: `GET http://localhost:3000/health`

CRUD solicitudes: `GET|POST /api/solicitudes`, `GET|PUT|DELETE /api/solicitudes/:id` (ver `http/solicitudes.http`).

## Modelo de datos

Ver `scripts/README.md`.
