import logging
from typing import Optional, Tuple, List
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.db import models
from app.repository import job_listing as repo
from app.schemas.job_listing import JobListingsQuery
from app.repository.company import get_recruiter_by_user_id

logger = logging.getLogger("app.controllers.job_listing")


def create_job_listing_controller(
    db: Session,
    *,
    current_user,
    payload: dict,
) -> models.JobPosting:
    logger.info(
        "create_job_listing_request: user_id=%s provided_company_id=%s",
        getattr(current_user, "user_id", None),
        payload.get("company_id"),
    )
    # Ensure current user is a recruiter and linked to a company
    recruiter = get_recruiter_by_user_id(db, current_user.user_id)
    if not recruiter:
        logger.warning("create_job_listing_forbidden: user_id=%s", getattr(current_user, "user_id", None))
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Recruiter profile not found")

    company_id = payload.get("company_id")
    if company_id is None:
        # default to recruiter's own company if not provided
        company_id = recruiter.company_id
    else:
        # verify recruiter belongs to that company
        if UUID(str(company_id)) != recruiter.company_id:
            logger.warning(
                "create_job_listing_wrong_company: user_id=%s company_id=%s recruiter_company_id=%s",
                getattr(current_user, "user_id", None),
                company_id,
                recruiter.company_id,
            )
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized for this company")

    job = repo.create_job_listing(
        db,
        company_id=company_id,
        recruiter_id=recruiter.recruiter_id,
        data=payload,
    )
    logger.info("job_listing_created: job_id=%s company_id=%s", getattr(job, "job_id", None), company_id)
    return job


def update_job_listing_controller(
    db: Session,
    *,
    current_user,
    job_id: UUID,
    update_data: dict,
) -> models.JobPosting:
    logger.debug(
        "update_job_listing_request: user_id=%s job_id=%s",
        getattr(current_user, "user_id", None),
        job_id,
    )
    # Must get the ORM model, not the response dict
    job = repo.get_job_listing_model(db, job_id)
    if not job:
        logger.warning("update_job_listing_not_found: job_id=%s", job_id)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job listing not found")

    recruiter = get_recruiter_by_user_id(db, current_user.user_id)
    if not recruiter or recruiter.company_id != job.company_id:
        logger.warning(
            "update_job_listing_forbidden: user_id=%s job_id=%s",
            getattr(current_user, "user_id", None),
            job_id,
        )
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this listing")

    job = repo.update_job_listing(db, job=job, update_data=update_data)
    logger.info("job_listing_updated: job_id=%s", getattr(job, "job_id", None))
    return job


def get_job_listing_controller(db: Session, *, job_id: UUID) -> models.JobPosting:
    logger.debug("get_job_listing_request: job_id=%s", job_id)
    job = repo.get_job_listing(db, job_id)
    if not job:
        logger.warning("get_job_listing_not_found: job_id=%s", job_id)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job listing not found")
    logger.info("get_job_listing_success: job_id=%s", getattr(job, "job_id", None))
    return job


def list_job_listings_controller(
    db: Session,
    *,
    company_id: Optional[UUID] = None,
    limit: Optional[int] = None,
):
    logger.debug("list_job_listings_request: company_id=%s limit=%s", company_id, limit)
    items = repo.list_job_listings(db, company_id=company_id, limit=limit)
    logger.info(
        "list_job_listings_success: company_id=%s count=%d",
        company_id,
        len(items) if hasattr(items, "__len__") else -1,
    )
    return items


def list_job_listings_paged_controller(
    db: Session,
    *,
    query: JobListingsQuery,
) -> tuple[list[dict], Optional[str]]:
    logger.debug(
        "list_job_listings_paged_request: company_id=%s location=%s job_type=%s exp=%s status=%s q=%s sort_by=%s sort_order=%s cursor=%s limit=%s",
        query.company_id,
        query.location,
        query.job_type,
        query.experience_level,
        query.status,
        query.q,
        query.sort_by,
        query.sort_order,
        query.cursor,
        query.limit,
    )
    limit = max(1, min(100, int(query.limit or 20)))
    items, next_cursor = repo.list_job_listings_paged(
        db,
        company_id=query.company_id,
        location=query.location,
        job_type=query.job_type,
        experience_level=query.experience_level,
        status=query.status,
        q=query.q,
        sort_by=query.sort_by,
        sort_order=query.sort_order,
        limit=limit,
        cursor=query.cursor,
    )
    logger.info(
        "list_job_listings_paged_success: count=%d next_cursor=%s",
        len(items) if hasattr(items, "__len__") else -1,
        next_cursor,
    )
    return items, next_cursor
