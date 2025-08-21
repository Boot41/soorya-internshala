from uuid import UUID
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.repository import application as repo


def apply_to_job_controller(
    db: Session,
    *,
    current_user,
    job_id: UUID,
    cover_letter: str | None,
):
    # Ensure job exists
    repo.ensure_job_exists(db, job_id=job_id)

    # Ensure user has an applicant profile
    applicant = repo.ensure_applicant_profile(db, user_id=current_user.user_id)

    # Check duplicate application
    existing = repo.get_application_by_job_and_applicant(db, job_id=job_id, applicant_id=applicant.applicant_id)
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Already applied to this job")

    app = repo.create_application(db, job_id=job_id, applicant_id=applicant.applicant_id, cover_letter=cover_letter)
    return app


def get_my_application_status_controller(
    db: Session,
    *,
    current_user,
    job_id: UUID,
):
    # Ensure job exists (consistent 404 if job invalid)
    repo.ensure_job_exists(db, job_id=job_id)

    # Ensure user is applicant
    applicant = repo.ensure_applicant_profile(db, user_id=current_user.user_id)

    app = repo.get_application_by_job_and_applicant(db, job_id=job_id, applicant_id=applicant.applicant_id)
    if not app:
        return {"has_applied": False, "application_id": None, "status": None}
    return {"has_applied": True, "application_id": app.application_id, "status": str(app.status)}


def list_my_applications_controller(
    db: Session,
    *,
    current_user,
):
    # Ensure user has an applicant profile
    applicant = repo.ensure_applicant_profile(db, user_id=current_user.user_id)
    # Fetch applications with job and company info
    return repo.list_applications_for_applicant(db, applicant_id=applicant.applicant_id)


def list_applications_for_job_controller(
    db: Session,
    *,
    job_id: UUID,
):
    """Recruiter-facing: list applications for a given job."""
    # Ensure job exists (consistent 404 if invalid)
    repo.ensure_job_exists(db, job_id=job_id)
    return repo.list_applications_for_job(db, job_id=job_id)


def update_application_status_controller(
    db: Session,
    *,
    application_id: UUID,
    status_value: str,
):
    """Recruiter-facing: update application status."""
    app = repo.update_application_status(db, application_id=application_id, status_value=status_value)
    return app
