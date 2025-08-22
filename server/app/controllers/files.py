import logging
from pathlib import Path
from uuid import uuid4
from typing import Optional

from fastapi import HTTPException, UploadFile, status
from app.core.config import settings
from sqlalchemy.orm import Session

from app.constants.paths import (
    ensure_static_dirs,
    RESUME_DIR,
    PROFILE_PICTURE_DIR,
    COMPANY_LOGO_DIR,
)
from app.db import models
from app.repository.company import get_recruiter_by_user_id

logger = logging.getLogger("app.controllers.files")

ALLOWED_EXTENSIONS = {
    "resume": {".pdf"},
    "profile": {".png", ".jpg", ".jpeg"},
    "logo": {".png", ".jpg", ".jpeg"},
}


async def save_uploaded_file(
    file: UploadFile,
    file_type: str,
    *,
    db: Session,
    current_user,
    company_id: Optional[str] = None,
) -> str:
    """
    Validates the uploaded file by type and saves into the static folder.
    Returns a public URL path (e.g., /static/resumes/<filename>).
    file_type: one of "resume" | "profile" | "logo"
    """
    logger.debug(
        "file_upload_request: user_id=%s type=%s filename=%s content_type=%s",
        getattr(current_user, "user_id", None),
        file_type,
        getattr(file, "filename", None),
        getattr(file, "content_type", None),
    )
    ensure_static_dirs()

    if file_type not in ALLOWED_EXTENSIONS:
        logger.warning("file_upload_invalid_type: type=%s", file_type)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type",
        )

    orig_name = file.filename or ""
    suffix = Path(orig_name).suffix.lower()
    content_type = (file.content_type or "").lower()

    # Decide target directory and URL prefix
    if file_type == "resume":
        # Must be PDF by extension OR content-type
        if suffix not in ALLOWED_EXTENSIONS["resume"] and content_type != "application/pdf":
            logger.warning(
                "file_upload_invalid_resume: suffix=%s content_type=%s",
                suffix,
                content_type,
            )
            raise HTTPException(
                status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                detail="Resume must be a PDF",
            )
        target_dir = RESUME_DIR
        url_prefix = "/static/resumes"
        ext = ".pdf" if suffix not in ALLOWED_EXTENSIONS["resume"] else suffix
    else:
        # profile/logo must be PNG or JPG
        valid_exts = ALLOWED_EXTENSIONS[file_type]
        if not (
            suffix in valid_exts
            or (content_type.startswith("image/") and suffix in {".png", ".jpg", ".jpeg"})
        ):
            logger.warning(
                "file_upload_invalid_image: suffix=%s content_type=%s",
                suffix,
                content_type,
            )
            raise HTTPException(
                status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                detail="Image must be PNG or JPG",
            )

        if file_type == "profile":
            target_dir = PROFILE_PICTURE_DIR
            url_prefix = "/static/profile_pictures"
        else:
            target_dir = COMPANY_LOGO_DIR
            url_prefix = "/static/company_logos"

        # Prefer valid provided extension, default to .png if ambiguous
        ext = suffix if suffix in valid_exts else ".png"

    # Generate a unique filename
    filename = f"{uuid4().hex}{ext}"
    destination = target_dir / filename

    # Persist file to disk
    data = await file.read()
    destination.write_bytes(data)

    # Return public URL (served by StaticFiles at /static)
    url = f"{settings.BACKEND_URL}{url_prefix}/{filename}"
    logger.info(
        "file_saved: user_id=%s type=%s path=%s bytes=%d",
        getattr(current_user, "user_id", None),
        file_type,
        str(destination),
        len(data) if isinstance(data, (bytes, bytearray)) else -1,
    )

    # Persist URL in the database based on file type
    if file_type in ("resume", "profile"):
        # Ensure Applicant row exists for the user
        applicant = (
            db.query(models.Applicant)
            .filter(models.Applicant.applicant_id == current_user.user_id)
            .first()
        )
        if not applicant:
            logger.debug("applicant_auto_create: user_id=%s", getattr(current_user, "user_id", None))
            applicant = models.Applicant(applicant_id=current_user.user_id)
            db.add(applicant)

        if file_type == "resume":
            applicant.resume_url = url
        else:
            applicant.profile_picture_url = url

        db.commit()
        logger.info(
            "applicant_updated_%s_url: user_id=%s url=%s",
            file_type,
            getattr(current_user, "user_id", None),
            url,
        )
    elif file_type == "logo":
        # Determine company to update
        target_company_id = company_id
        if target_company_id is None:
            recruiter = get_recruiter_by_user_id(db, current_user.user_id)
            if not recruiter:
                logger.warning(
                    "logo_upload_forbidden: user_id=%s",
                    getattr(current_user, "user_id", None),
                )
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Recruiter/company not found for current user",
                )
            target_company_id = str(recruiter.company_id)

        company = (
            db.query(models.Company)
            .filter(models.Company.company_id == target_company_id)
            .first()
        )
        if not company:
            logger.warning("logo_upload_company_not_found: company_id=%s", target_company_id)
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
        company.logo_url = url
        db.commit()
        logger.info("company_logo_updated: company_id=%s url=%s", target_company_id, url)

    return url