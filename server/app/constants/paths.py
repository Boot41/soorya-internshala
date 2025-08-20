from pathlib import Path

# Base directory of the FastAPI app package (app/)
APP_DIR = Path(__file__).resolve().parents[1]

# Static directory and subdirectories
STATIC_DIR = APP_DIR / "static"
RESUME_DIR = STATIC_DIR / "resumes"
PROFILE_PICTURE_DIR = STATIC_DIR / "profile_pictures"
COMPANY_LOGO_DIR = STATIC_DIR / "company_logos"


def ensure_static_dirs() -> None:
    """Create static folders if they don't exist."""
    for d in (STATIC_DIR, RESUME_DIR, PROFILE_PICTURE_DIR, COMPANY_LOGO_DIR):
        d.mkdir(parents=True, exist_ok=True)
