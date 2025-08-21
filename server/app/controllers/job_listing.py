from typing import Optional
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.db import models
from app.repository import job_listing as repo
from app.repository.company import get_recruiter_by_user_id


def create_job_listing_controller(
    db: Session,
    *,
    current_user,
    payload: dict,
) -> models.JobPosting:
    # Ensure current user is a recruiter and linked to a company
    recruiter = get_recruiter_by_user_id(db, current_user.user_id)
    if not recruiter:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Recruiter profile not found")

    company_id = payload.get("company_id")
    if company_id is None:
        # default to recruiter's own company if not provided
        company_id = recruiter.company_id
    else:
        # verify recruiter belongs to that company
        if UUID(str(company_id)) != recruiter.company_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized for this company")

    job = repo.create_job_listing(
        db,
        company_id=company_id,
        recruiter_id=recruiter.recruiter_id,
        data=payload,
    )
    return job


def update_job_listing_controller(
    db: Session,
    *,
    current_user,
    job_id: UUID,
    update_data: dict,
) -> models.JobPosting:
    job = repo.get_job_listing(db, job_id)
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job listing not found")

    recruiter = get_recruiter_by_user_id(db, current_user.user_id)
    if not recruiter or recruiter.company_id != job.company_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this listing")

    job = repo.update_job_listing(db, job=job, update_data=update_data)
    return job


def get_job_listing_controller(db: Session, *, job_id: UUID) -> models.JobPosting:
    job = repo.get_job_listing(db, job_id)
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job listing not found")
    return job


def list_job_listings_controller(
    db: Session,
    *,
    company_id: Optional[UUID] = None,
    limit: Optional[int] = None,
):
    return repo.list_job_listings(db, company_id=company_id, limit=limit)
