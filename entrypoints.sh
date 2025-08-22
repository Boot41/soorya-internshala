#!/usr/bin/env bash
set -euo pipefail

export PYTHONPATH=/app

if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL environment variable is not set."
  exit 1
fi

sed -i "s|\${DATABASE_URL}|$DATABASE_URL|g" /app/alembic.ini

# # Run database migrations inside project env
uv run alembic -c /app/alembic.ini upgrade head

# # Start the FastAPI app (module:function)
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000