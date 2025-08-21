from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import require_recruiter
from app.db.session import get_db
from app.controllers import job_listing as controller
from app.schemas.job_listing import (
    JobListingCreate,
    JobListingUpdate,
    JobListingResponse,
)

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


@router.get("/{job_id}", response_model=JobListingResponse)
def get_job_listing(job_id: UUID, db: Session = Depends(get_db)):
    job = controller.get_job_listing_controller(db, job_id=job_id)
    return job
