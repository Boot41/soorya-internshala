from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.v1.api import api_router
from app.core.config import settings
from app.constants.paths import ensure_static_dirs, STATIC_DIR

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.FRONTEND_URLS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure static directories exist and mount them for serving
ensure_static_dirs()
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

app.include_router(api_router, prefix=settings.API_V1_STR)
