from sqlalchemy.orm import Session
from sqlalchemy import and_
from uuid import UUID

from app.db.models import Application, JobPosting, Applicant, User, Company
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


def list_applications_for_job(db: Session, *, job_id: UUID):
    """
    Returns list of applications for a job with applicant name and resume url.
    """
    # join applications -> applicants (resume_url) -> users (name)
    q = (
        db.query(
            Application.application_id,
            Application.applicant_id,
            Application.status,
            Applicant.resume_url,
            User.first_name,
            User.last_name,
            User.email,
        )
        .join(Applicant, Applicant.applicant_id == Application.applicant_id)
        .join(User, User.user_id == Applicant.applicant_id)
        .filter(Application.job_id == job_id)
        .order_by(Application.applied_at.desc())
    )
    rows = q.all()
    return [
        {
            "application_id": r.application_id,
            "applicant_id": r.applicant_id,
            "status": str(r.status),
            "resume_url": r.resume_url,
            "applicant_name": f"{r.first_name} {r.last_name}",
            "applicant_email": r.email,
        }
        for r in rows
    ]


def update_application_status(db: Session, *, application_id: UUID, status_value: str) -> Application:
    app = db.query(Application).filter(Application.application_id == application_id).first()
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    app.status = status_value
    db.commit()
    db.refresh(app)
    return app


def list_applications_for_applicant(db: Session, *, applicant_id: UUID):
    """
    Returns list of applications for an applicant with joined job and company info.
    """
    q = (
        db.query(
            Application.application_id,
            Application.status,
            JobPosting.job_id,
            JobPosting.title.label("job_title"),
            JobPosting.job_type,
            JobPosting.location.label("job_location"),
            Company.company_id,
            Company.name.label("company_name"),
        )
        .join(JobPosting, JobPosting.job_id == Application.job_id)
        .join(Company, Company.company_id == JobPosting.company_id)
        .filter(Application.applicant_id == applicant_id)
        .order_by(Application.applied_at.desc())
    )
    rows = q.all()
    return [
        {
            "application_id": r.application_id,
            "status": str(r.status),
            "job_id": r.job_id,
            "job_title": r.job_title,
            "job_type": str(r.job_type),
            "job_location": r.job_location,
            "company_id": r.company_id,
            "company_name": r.company_name,
        }
        for r in rows
    ]
