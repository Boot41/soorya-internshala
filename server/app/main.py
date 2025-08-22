import logging
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.exceptions import RequestValidationError

from app.api.v1.api import api_router
from app.core.config import settings
from app.constants.paths import ensure_static_dirs, STATIC_DIR
from app.core.logger import setup_logging

# Initialize logging early
setup_logging()

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
app.mount("/assets", StaticFiles(directory=str(STATIC_DIR / "assets")), name="assets")

app.include_router(api_router, prefix=settings.API_V1_STR)

# Serve SPA index.html for root and any non-API path
@app.get("/{full_path:path}", include_in_schema=False)
def spa_catch_all(full_path: str):
    if full_path.startswith("api") or full_path.startswith("assets"):
        raise HTTPException(status_code=404)
    return FileResponse(str(STATIC_DIR / "index.html"))


logger = logging.getLogger("app")


@app.exception_handler(HTTPException)
def http_exception_handler(request: Request, exc: HTTPException):
    logger.warning("HTTPException: %s %s -> %s", request.method, request.url.path, exc.detail)
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "type": "http_error",
                "status": exc.status_code,
                "detail": exc.detail,
                "path": request.url.path,
            }
        },
    )


@app.exception_handler(RequestValidationError)
def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.info("ValidationError: %s %s -> %s", request.method, request.url.path, exc.errors())
    return JSONResponse(
        status_code=422,
        content={
            "error": {
                "type": "validation_error",
                "status": 422,
                "detail": exc.errors(),
                "path": request.url.path,
            }
        },
    )


@app.exception_handler(Exception)
def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("UnhandledException: %s %s", request.method, request.url.path)
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "type": "server_error",
                "status": 500,
                "detail": "Internal Server Error",
                "path": request.url.path,
            }
        },
    )
