from typing import Union
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.db import models
from app.schemas.user import (
    UserProfileApplicantResponse,
    UserProfileRecruiterResponse,
    UpdateUserProfile,
)
from app.controllers.user import (
    get_profile_me_controller,
    update_profile_me_controller,
    get_profile_by_user_id_controller,
)

router = APIRouter()


@router.get("/me", response_model=Union[UserProfileApplicantResponse, UserProfileRecruiterResponse])
def get_me(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    return get_profile_me_controller(db, current_user=current_user)


@router.put("/me")
def update_me(
    update: UpdateUserProfile,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return update_profile_me_controller(db, current_user=current_user, update=update)


# Get user profile by user_id (applicant or recruiter)
@router.get("/{user_id}", response_model=Union[UserProfileApplicantResponse, UserProfileRecruiterResponse])
def get_user_by_id(
    user_id: UUID,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_profile_by_user_id_controller(db, user_id=user_id)
