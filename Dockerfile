FROM node:20-slim AS client-builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY client/web/package.json client/web/pnpm-lock.yaml ./

RUN pnpm install

COPY client/web .

RUN pnpm run build

FROM ghcr.io/astral-sh/uv:python3.12-bookworm AS server

WORKDIR /app

COPY server/pyproject.toml server/uv.lock ./

RUN uv sync --frozen

COPY server .

COPY --from=client-builder /app/dist ./app/static/

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONPATH=/app

EXPOSE 8000

ENTRYPOINT ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
