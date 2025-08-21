from typing import Optional, List
from uuid import UUID

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.db.models import JobPosting


def get_job_listing(db: Session, job_id: UUID) -> JobPosting | None:
    return db.query(JobPosting).filter(JobPosting.job_id == job_id).first()


def list_job_listings(db: Session, *, company_id: Optional[UUID] = None) -> List[JobPosting]:
    q = db.query(JobPosting)
    if company_id:
        q = q.filter(JobPosting.company_id == company_id)
    return q.order_by(JobPosting.posted_at.desc()).all()


def create_job_listing(
    db: Session,
    *,
    company_id: UUID,
    recruiter_id: UUID,
    data: dict,
) -> JobPosting:
    job = JobPosting(
        company_id=company_id,
        recruiter_id=recruiter_id,
        title=data["title"],
        description=data["description"],
        requirements=data["requirements"],
        skills_required=data.get("skills_required"),
        location=data["location"],
        experience_level=data.get("experience_level"),
        job_type=data["job_type"],
        salary_range=data.get("salary_range"),
        expires_at=data.get("expires_at"),
        status=data.get("status", "open"),
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


def update_job_listing(
    db: Session,
    *,
    job: JobPosting,
    update_data: dict,
) -> JobPosting:
    allowed = {
        "title",
        "description",
        "requirements",
        "skills_required",
        "location",
        "experience_level",
        "job_type",
        "salary_range",
        "expires_at",
        "status",
    }
    for field, value in update_data.items():
        if field in allowed and value is not None:
            setattr(job, field, value)
    db.add(job)
    db.commit()
    db.refresh(job)
    return job
