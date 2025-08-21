from typing import Optional, List
from uuid import UUID

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.db.models import JobPosting, Company


def _to_response_dict(job: JobPosting, *, company_name: str) -> dict:
    return {
        "job_id": job.job_id,
        "company_id": job.company_id,
        "company_name": company_name,
        "recruiter_id": job.recruiter_id,
        "title": job.title,
        "description": job.description,
        "requirements": job.requirements,
        "skills_required": job.skills_required,
        "location": job.location,
        "experience_level": job.experience_level,
        "job_type": job.job_type,
        "salary_range": job.salary_range,
        "expires_at": job.expires_at,
        "status": job.status,
        "posted_at": job.posted_at,
        "updated_at": job.updated_at,
    }


def get_job_listing(db: Session, job_id: UUID) -> dict | None:
    row = (
        db.query(JobPosting, Company.name.label("company_name"))
        .join(Company, Company.company_id == JobPosting.company_id)
        .filter(JobPosting.job_id == job_id)
        .first()
    )
    if not row:
        return None
    job, company_name = row
    return _to_response_dict(job, company_name=company_name)


def list_job_listings(
    db: Session,
    *,
    company_id: Optional[UUID] = None,
    limit: Optional[int] = None,
) -> List[dict]:
    q = db.query(JobPosting, Company.name.label("company_name")).join(Company, Company.company_id == JobPosting.company_id)
    if company_id:
        q = q.filter(JobPosting.company_id == company_id)
    q = q.order_by(JobPosting.posted_at.desc())
    if isinstance(limit, int) and limit > 0:
        q = q.limit(limit)
    rows = q.all()
    return [_to_response_dict(job, company_name=company_name) for job, company_name in rows]


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
