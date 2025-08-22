# Internhub

## About the Application
- Full‑stack app:
  - Client: React (Vite) in `client/web/`
  - Server: FastAPI in `server/`
- PostgreSQL as the database.
- In production/Docker, the frontend is built and served as static assets by the backend.

## Minimum Requirements
- Node.js 18+ (recommend 20+)
- pnpm (via Corepack: Node 18+ has it)
- Python 3.12
- uv (Python package/dependency manager)
- PostgreSQL 15+ (for local DB) or Docker + Docker Compose

## Repository Structure
- `client/web/` — React app (Vite)
- `server/` — FastAPI server, Alembic migrations, tests
- `compose.yml` — Docker Compose for app + Postgres
- `Dockerfile` — Multistage build (client + server)

## Environment Variables

Copy the example files and fill values:

- Root: `.env.example` → `.env`
  - POSTGRES_USER=
  - POSTGRES_PASSWORD=
  - POSTGRES_DB=
  - DATABASE_URL=
  - FRONTEND_URLS=
  - BACKEND_URL=
  - SECRET_KEY=

- Client: `client/web/.env.example` → `client/web/.env`
  - VITE_BACKEND_URL=

Example (Docker):
- DATABASE_URL=postgresql://postgres:postgres@postgres:5432/internhub

## Run Locally (without Docker)

1) Start PostgreSQL
- Ensure a Postgres instance is running and `DATABASE_URL` points to it.

2) Backend (server/)
- Path: `server/`
- Steps:
```
cp .env.example .env     # fill values
uv sync
uv run alembic upgrade head
# optionally seed:
uv run python scripts/seed.py
# dev run (reload)
uv run fastapi dev app
```

3) Frontend (client/web/)
- Path: `client/web/`
- Steps:
```
cp .env.example .env   # set VITE_BACKEND_URL (e.g., http://localhost:8000)
pnpm install
pnpm dev
```

## Run with Docker

1) From repository root:
```
cp .env.example .env   # fill values (including DATABASE_URL)
docker compose up --build
```

2) Open:
- http://localhost:8000

Notes:
- Inside Compose, the Postgres hostname is `postgres` (service name).
- The backend runs Alembic migrations at start.

## Testing
- From `server/`:
```
uv run pytest -q
```
