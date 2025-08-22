import logging
import logging.config
import os


def setup_logging() -> None:
    """Configure application-wide logging.

    - Logs to stdout
    - Honors LOG_LEVEL env (default INFO)
    - Integrates uvicorn/fastapi loggers
    """
    level = os.getenv("LOG_LEVEL", "INFO").upper()

    config = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "standard": {
                "format": "%(asctime)s %(levelname)s %(name)s - %(message)s",
            },
            "access": {
                "format": "%(asctime)s %(levelname)s uvicorn.access - %(message)s",
            },
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "level": level,
                "formatter": "standard",
                "stream": "ext://sys.stdout",
            },
            "access_console": {
                "class": "logging.StreamHandler",
                "level": level,
                "formatter": "access",
                "stream": "ext://sys.stdout",
            },
        },
        "loggers": {
            # Our app
            "app": {"handlers": ["console"], "level": level, "propagate": False},
            # Uvicorn/fastapi
            "uvicorn": {"handlers": ["console"], "level": level, "propagate": False},
            "uvicorn.error": {"handlers": ["console"], "level": level, "propagate": False},
            "uvicorn.access": {"handlers": ["access_console"], "level": level, "propagate": False},
            "fastapi": {"handlers": ["console"], "level": level, "propagate": False},
            # SQLAlchemy (optional: reduce noise)
            "sqlalchemy.engine": {
                "handlers": ["console"],
                "level": os.getenv("SQLALCHEMY_LOG_LEVEL", "WARNING").upper(),
                "propagate": False,
            },
        },
        "root": {"handlers": ["console"], "level": level},
    }

    logging.config.dictConfig(config)
