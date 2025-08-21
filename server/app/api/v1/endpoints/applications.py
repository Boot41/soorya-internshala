from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_recruiter
from app.db.session import get_db
from app.repository import application as repo
from app.controllers import application as app_controller
from app.schemas.application import (
    ApplicationListItem,
    UpdateApplicationStatusRequest,
    UpdateApplicationStatusResponse,
)

router = APIRouter()


@router.get("/", response_model=List[ApplicationListItem])
def list_applications(
    job_id: UUID = Query(..., description="Job ID to fetch applications for"),
    db: Session = Depends(get_db),
    _=Depends(require_recruiter),
):
    return app_controller.list_applications_for_job_controller(db, job_id=job_id)


@router.patch("/{application_id}", response_model=UpdateApplicationStatusResponse)
def update_application(
    application_id: UUID,
    payload: UpdateApplicationStatusRequest,
    db: Session = Depends(get_db),
    _=Depends(require_recruiter),
):
    app_controller.update_application_status_controller(
        db,
        application_id=application_id,
        status_value=payload.status,
    )
    return {"message": "Application status updated"}
