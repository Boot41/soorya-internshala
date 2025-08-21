from sqlalchemy.orm import Session
from sqlalchemy import func
from uuid import UUID

from app.db.models import JobPosting, Application


def get_recruiter_dashboard_stats(db: Session, *, recruiter_id: UUID) -> dict:
    """
    Returns aggregate counts for a recruiter:
    - total_jobs: all jobs created by this recruiter
    - total_open_jobs: jobs with status 'open'
    - total_draft_jobs: jobs with status 'draft'
    - total_applications: applications across all jobs created by this recruiter
    """
    # Base subquery for recruiter's jobs
    jobs_q = db.query(JobPosting.job_id, JobPosting.status).filter(JobPosting.recruiter_id == recruiter_id).subquery()

    # Counts on jobs
    total_jobs = db.query(func.count()).select_from(jobs_q).scalar() or 0
    total_open_jobs = (
        db.query(func.count()).select_from(jobs_q).filter(jobs_q.c.status == 'open').scalar() or 0
    )
    total_draft_jobs = (
        db.query(func.count()).select_from(jobs_q).filter(jobs_q.c.status == 'draft').scalar() or 0
    )

    # Total applications across those jobs
    total_applications = (
        db.query(func.count(Application.application_id))
        .join(jobs_q, jobs_q.c.job_id == Application.job_id)
        .scalar()
        or 0
    )

    return {
        "total_jobs": int(total_jobs),
        "total_open_jobs": int(total_open_jobs),
        "total_draft_jobs": int(total_draft_jobs),
        "total_applications": int(total_applications),
    }
