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
