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

router = APIRouter()


@router.get("/me", response_model=Union[UserProfileApplicantResponse, UserProfileRecruiterResponse])
def get_me(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.user_type == "applicant":
        applicant = db.query(models.Applicant).filter(models.Applicant.applicant_id == current_user.user_id).first()
        # Build applicant response with defaults if missing
        return UserProfileApplicantResponse(
            user_id=current_user.user_id,
            email=current_user.email,
            user_type=current_user.user_type,
            first_name=current_user.first_name,
            last_name=current_user.last_name,
            headline=getattr(applicant, "headline", None) if applicant else None,
            bio=getattr(applicant, "bio", None) if applicant else None,
            resume_url=getattr(applicant, "resume_url", None) if applicant else None,
            experience=getattr(applicant, "experience", []) if applicant and applicant.experience else [],
            education=getattr(applicant, "education", []) if applicant and applicant.education else [],
            profile_picture_url=getattr(applicant, "profile_picture_url", None) if applicant else None,
        )
    elif current_user.user_type == "recruiter":
        recruiter = db.query(models.Recruiter).filter(models.Recruiter.recruiter_id == current_user.user_id).first()
        return UserProfileRecruiterResponse(
            user_id=current_user.user_id,
            email=current_user.email,
            user_type=current_user.user_type,
            first_name=current_user.first_name,
            last_name=current_user.last_name,
            company_id=getattr(recruiter, "company_id", None) if recruiter else None,
        )

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User profile not found")


@router.put("/me")
def update_me(
    update: UpdateUserProfile,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.user_type == "applicant":
        applicant = db.query(models.Applicant).filter(models.Applicant.applicant_id == current_user.user_id).first()
        if not applicant:
            applicant = models.Applicant(applicant_id=current_user.user_id)
            db.add(applicant)
        # Apply partial updates
        data = update.dict(exclude_unset=True)
        for field in ["headline", "bio", "resume_url", "experience", "education", "profile_picture_url"]:
            if field in data:
                setattr(applicant, field, data[field])
        db.commit()
        return {"message": "Profile updated successfully"}

    elif current_user.user_type == "recruiter":
        data = update.dict(exclude_unset=True)
        if "company_id" not in data:
            # Nothing to update for recruiter
            return {"message": "Profile updated successfully"}

        # Validate company exists
        company_id = data["company_id"]
        if company_id is not None:
            company = db.query(models.Company).filter(models.Company.company_id == company_id).first()
            if not company:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")

        recruiter = db.query(models.Recruiter).filter(models.Recruiter.recruiter_id == current_user.user_id).first()
        if recruiter:
            recruiter.company_id = company_id
        else:
            recruiter = models.Recruiter(recruiter_id=current_user.user_id, company_id=company_id)
            db.add(recruiter)
        db.commit()
        return {"message": "Profile updated successfully"}

    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user type")
