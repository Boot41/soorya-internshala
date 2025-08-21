from typing import Optional, List, Tuple
from uuid import UUID
from datetime import datetime

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.db.models import JobPosting, Company
from sqlalchemy import or_, and_
import uuid as uuidlib


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


def _decode_cursor(cursor: Optional[str]) -> Optional[Tuple[datetime, UUID]]:
    if not cursor:
        return None
    try:
        ts_str, uuid_str = cursor.split("|", 1)
        return datetime.fromisoformat(ts_str), UUID(uuid_str)
    except Exception:
        return None


def _encode_cursor(ts: datetime, job_id: UUID) -> str:
    return f"{ts.isoformat()}|{str(job_id)}"


def list_job_listings_paged(
    db: Session,
    *,
    company_id: Optional[UUID] = None,
    location: Optional[str] = None,
    job_type: Optional[str] = None,
    experience_level: Optional[str] = None,
    status: Optional[str] = None,
    q: Optional[str] = None,
    sort_by: str = "posted_at",
    sort_order: str = "desc",
    limit: int = 20,
    cursor: Optional[str] = None,
) -> Tuple[List[dict], Optional[str]]:
    # base query with company join for name
    qy = db.query(JobPosting, Company.name.label("company_name")).join(Company, Company.company_id == JobPosting.company_id)

    # filters
    if company_id:
        qy = qy.filter(JobPosting.company_id == company_id)
    if location:
        qy = qy.filter(JobPosting.location.ilike(f"%{location}%"))
    if job_type:
        qy = qy.filter(JobPosting.job_type == job_type)
    if experience_level:
        qy = qy.filter(JobPosting.experience_level == experience_level)
    if status:
        qy = qy.filter(JobPosting.status == status)
    if q:
        like = f"%{q}%"
        qy = qy.filter(
            or_(
                JobPosting.title.ilike(like),
                JobPosting.description.ilike(like),
                JobPosting.location.ilike(like),
            )
        )

    # sorting
    sort_col = JobPosting.updated_at if sort_by == "updated_at" else JobPosting.posted_at
    if sort_order == "asc":
        qy = qy.order_by(sort_col.asc(), JobPosting.job_id.asc())
    else:
        qy = qy.order_by(sort_col.desc(), JobPosting.job_id.desc())

    # cursor
    cur = _decode_cursor(cursor)
    if cur is not None:
        ts, jid = cur
        if sort_order == "asc":
            cond = or_(sort_col > ts, and_(sort_col == ts, JobPosting.job_id > jid))
        else:
            cond = or_(sort_col < ts, and_(sort_col == ts, JobPosting.job_id < jid))
        qy = qy.filter(cond)

    # limit + 1 to know if next page exists
    real_limit = max(1, min(100, int(limit)))
    rows = qy.limit(real_limit + 1).all()

    has_more = len(rows) > real_limit
    rows = rows[:real_limit]

    items = [_to_response_dict(job, company_name=company_name) for job, company_name in rows]
    next_cursor = None
    if has_more and rows:
        last_job: JobPosting = rows[-1][0]
        last_ts: datetime = getattr(last_job, 'updated_at' if sort_by == 'updated_at' else 'posted_at')
        next_cursor = _encode_cursor(last_ts, last_job.job_id)

    return items, next_cursor


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
