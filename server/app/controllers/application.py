import logging
from uuid import UUID
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.repository import application as repo

logger = logging.getLogger("app.controllers.application")


def apply_to_job_controller(
    db: Session,
    *,
    current_user,
    job_id: UUID,
    cover_letter: str | None,
):
    logger.info("apply_to_job: user=%s job_id=%s", getattr(current_user, "user_id", None), job_id)
    # Ensure job exists
    repo.ensure_job_exists(db, job_id=job_id)

    # Ensure user has an applicant profile
    applicant = repo.ensure_applicant_profile(db, user_id=current_user.user_id)

    # Check duplicate application
    existing = repo.get_application_by_job_and_applicant(db, job_id=job_id, applicant_id=applicant.applicant_id)
    if existing:
        logger.warning("duplicate_application: applicant_id=%s job_id=%s", applicant.applicant_id, job_id)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Already applied to this job")

    app = repo.create_application(db, job_id=job_id, applicant_id=applicant.applicant_id, cover_letter=cover_letter)
    logger.info("application_created: application_id=%s", getattr(app, "application_id", None))
    return app


def get_my_application_status_controller(
    db: Session,
    *,
    current_user,
    job_id: UUID,
):
    logger.debug("get_my_application_status: user=%s job_id=%s", getattr(current_user, "user_id", None), job_id)
    # Ensure job exists (consistent 404 if job invalid)
    repo.ensure_job_exists(db, job_id=job_id)

    # Ensure user is applicant
    applicant = repo.ensure_applicant_profile(db, user_id=current_user.user_id)

    app = repo.get_application_by_job_and_applicant(db, job_id=job_id, applicant_id=applicant.applicant_id)
    if not app:
        logger.info("application_status: not_applied applicant_id=%s job_id=%s", applicant.applicant_id, job_id)
        return {"has_applied": False, "application_id": None, "status": None}
    payload = {"has_applied": True, "application_id": app.application_id, "status": str(app.status)}
    logger.info("application_status: %s", payload)
    return payload


def list_my_applications_controller(
    db: Session,
    *,
    current_user,
):
    logger.debug("list_my_applications: user=%s", getattr(current_user, "user_id", None))
    # Ensure user has an applicant profile
    applicant = repo.ensure_applicant_profile(db, user_id=current_user.user_id)
    # Fetch applications with job and company info
    items = repo.list_applications_for_applicant(db, applicant_id=applicant.applicant_id)
    logger.info("list_my_applications: applicant_id=%s count=%d", applicant.applicant_id, len(items) if hasattr(items, "__len__") else -1)
    return items


def list_applications_for_job_controller(
    db: Session,
    *,
    job_id: UUID,
):
    """Recruiter-facing: list applications for a given job."""
    logger.debug("list_applications_for_job: job_id=%s", job_id)
    # Ensure job exists (consistent 404 if invalid)
    repo.ensure_job_exists(db, job_id=job_id)
    items = repo.list_applications_for_job(db, job_id=job_id)
    logger.info("list_applications_for_job: job_id=%s count=%d", job_id, len(items) if hasattr(items, "__len__") else -1)
    return items


def update_application_status_controller(
    db: Session,
    *,
    application_id: UUID,
    status_value: str,
):
    """Recruiter-facing: update application status."""
    logger.info("update_application_status: application_id=%s status=%s", application_id, status_value)
    app = repo.update_application_status(db, application_id=application_id, status_value=status_value)
    logger.info("application_status_updated: application_id=%s status=%s", application_id, getattr(app, "status", None))
    return app
