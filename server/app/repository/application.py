from sqlalchemy.orm import Session
from sqlalchemy import and_
from uuid import UUID

from app.db.models import Application, JobPosting, Applicant
from fastapi import HTTPException, status


def get_application_by_job_and_applicant(db: Session, *, job_id: UUID, applicant_id: UUID) -> Application | None:
    return (
        db.query(Application)
        .filter(and_(Application.job_id == job_id, Application.applicant_id == applicant_id))
        .first()
    )


def create_application(db: Session, *, job_id: UUID, applicant_id: UUID, cover_letter: str | None) -> Application:
    app = Application(
        job_id=job_id,
        applicant_id=applicant_id,
        status="applied",
        cover_letter=cover_letter,
    )
    db.add(app)
    db.commit()
    db.refresh(app)
    return app


def ensure_job_exists(db: Session, *, job_id: UUID) -> JobPosting:
    job = db.query(JobPosting).filter(JobPosting.job_id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job listing not found")
    return job


def ensure_applicant_profile(db: Session, *, user_id: UUID) -> Applicant:
    applicant = db.query(Applicant).filter(Applicant.applicant_id == user_id).first()
    if not applicant:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Applicant profile not found")
    return applicant
