from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_recruiter, require_applicant
from app.db.session import get_db
from app.controllers import job_listing as controller
from app.controllers import application as application_controller
from app.schemas.job_listing import (
    JobListingCreate,
    JobListingUpdate,
    JobListingResponse,
    JobListingsQuery,
    PagedJobListingsResponse,
)
from app.schemas.application import ApplyRequest, ApplyResponse, ApplicationStatusResponse

router = APIRouter()


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_job_listing(
    payload: JobListingCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_recruiter),
):
    job = controller.create_job_listing_controller(
        db,
        current_user=current_user,
        payload=payload.model_dump(),
    )
    return {"message": "Job listing created successfully", "job_id": job.job_id}


@router.put("/{job_id}")
def update_job_listing(
    job_id: UUID,
    payload: JobListingUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_recruiter),
):
    controller.update_job_listing_controller(
        db,
        current_user=current_user,
        job_id=job_id,
        update_data=payload.model_dump(exclude_unset=True),
    )
    return {"message": "Job listing updated successfully"}


@router.get("/", response_model=List[JobListingResponse])
def list_job_listings(
    db: Session = Depends(get_db),
    company_id: Optional[UUID] = None,
    limit: Optional[int] = None,
):
    jobs = controller.list_job_listings_controller(db, company_id=company_id, limit=limit)
    return jobs


@router.get("/feed", response_model=PagedJobListingsResponse)
def list_job_listings_feed(
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
    params: JobListingsQuery = Depends(),
):
    items, next_cursor = controller.list_job_listings_paged_controller(db, query=params)
    return {"items": items, "next_cursor": next_cursor}


@router.get("/{job_id}", response_model=JobListingResponse)
def get_job_listing(job_id: UUID, db: Session = Depends(get_db)):
    job = controller.get_job_listing_controller(db, job_id=job_id)
    return job


@router.post("/{job_id}/apply", status_code=status.HTTP_201_CREATED, response_model=ApplyResponse)
def apply_to_job(
    job_id: UUID,
    payload: ApplyRequest,
    db: Session = Depends(get_db),
    current_user=Depends(require_applicant),
):
    app = application_controller.apply_to_job_controller(
        db,
        current_user=current_user,
        job_id=job_id,
        cover_letter=payload.cover_letter,
    )
    return {"message": "Application submitted successfully", "application_id": app.application_id}


@router.get("/{job_id}/application/me", response_model=ApplicationStatusResponse)
def get_my_application_status(
    job_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(require_applicant),
):
    result = application_controller.get_my_application_status_controller(
        db,
        current_user=current_user,
        job_id=job_id,
    )
    return result
