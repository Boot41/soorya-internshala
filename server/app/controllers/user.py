import logging
from typing import Union
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.db import models
from app.repository import user as user_repo
from app.repository.company import get_recruiter_by_user_id, get_company
from app.schemas.user import (
    UserProfileApplicantResponse,
    UserProfileRecruiterResponse,
    UpdateUserProfile,
)

logger = logging.getLogger("app.controllers.user")


def _build_applicant_response(user: models.User, applicant: models.Applicant | None) -> UserProfileApplicantResponse:
    return UserProfileApplicantResponse(
        user_id=user.user_id,
        email=user.email,
        user_type=user.user_type,
        first_name=user.first_name,
        last_name=user.last_name,
        headline=getattr(applicant, "headline", None) if applicant else None,
        bio=getattr(applicant, "bio", None) if applicant else None,
        resume_url=getattr(applicant, "resume_url", None) if applicant else None,
        experience=getattr(applicant, "experience", []) if applicant and applicant.experience else [],
        education=getattr(applicant, "education", []) if applicant and applicant.education else [],
        profile_picture_url=getattr(applicant, "profile_picture_url", None) if applicant else None,
        skills=getattr(applicant, "skills", []) if applicant and applicant.skills else [],
    )


def _build_recruiter_response(user: models.User, recruiter: models.Recruiter | None) -> UserProfileRecruiterResponse:
    return UserProfileRecruiterResponse(
        user_id=user.user_id,
        email=user.email,
        user_type=user.user_type,
        first_name=user.first_name,
        last_name=user.last_name,
        company_id=getattr(recruiter, "company_id", None) if recruiter else None,
    )


def get_profile_me_controller(db: Session, *, current_user) -> Union[UserProfileApplicantResponse, UserProfileRecruiterResponse]:
    logger.debug(
        "get_profile_me_request: user_id=%s user_type=%s",
        getattr(current_user, "user_id", None),
        getattr(current_user, "user_type", None),
    )
    if current_user.user_type == "applicant":
        applicant = user_repo.get_applicant_by_user_id(db, current_user.user_id)
        logger.info(
            "get_profile_me_applicant: user_id=%s has_applicant=%s",
            getattr(current_user, "user_id", None),
            applicant is not None,
        )
        return _build_applicant_response(current_user, applicant)
    elif current_user.user_type == "recruiter":
        recruiter = get_recruiter_by_user_id(db, current_user.user_id)
        logger.info(
            "get_profile_me_recruiter: user_id=%s has_recruiter=%s",
            getattr(current_user, "user_id", None),
            recruiter is not None,
        )
        return _build_recruiter_response(current_user, recruiter)
    logger.warning("get_profile_me_not_found: user_id=%s", getattr(current_user, "user_id", None))
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User profile not found")


def update_profile_me_controller(db: Session, *, current_user, update: UpdateUserProfile) -> dict:
    logger.info(
        "update_profile_me_request: user_id=%s user_type=%s",
        getattr(current_user, "user_id", None),
        getattr(current_user, "user_type", None),
    )
    if current_user.user_type == "applicant":
        applicant = user_repo.get_applicant_by_user_id(db, current_user.user_id)
        if not applicant:
            logger.debug("create_applicant_profile: user_id=%s", getattr(current_user, "user_id", None))
            applicant = models.Applicant(applicant_id=current_user.user_id)
            db.add(applicant)
        data = update.dict(exclude_unset=True)
        url_fields = {"resume_url", "profile_picture_url"}
        for field in ["headline", "bio", "resume_url", "experience", "education", "profile_picture_url", "skills"]:
            if field in data:
                value = data[field]
                if field in url_fields and value is not None:
                    setattr(applicant, field, str(value))
                else:
                    setattr(applicant, field, value)
        db.commit()
        logger.info("update_profile_me_applicant_success: user_id=%s", getattr(current_user, "user_id", None))
        return {"message": "Profile updated successfully"}

    elif current_user.user_type == "recruiter":
        data = update.dict(exclude_unset=True)
        if "company_id" not in data:
            logger.debug("update_profile_me_recruiter_noop: user_id=%s", getattr(current_user, "user_id", None))
            return {"message": "Profile updated successfully"}
        company_id = data["company_id"]
        if company_id is not None:
            company = get_company(db, company_id)
            if not company:
                logger.warning("update_profile_me_company_not_found: user_id=%s company_id=%s", getattr(current_user, "user_id", None), company_id)
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
        recruiter = get_recruiter_by_user_id(db, current_user.user_id)
        if recruiter:
            recruiter.company_id = company_id
        else:
            recruiter = models.Recruiter(recruiter_id=current_user.user_id, company_id=company_id)
            db.add(recruiter)
        db.commit()
        logger.info("update_profile_me_recruiter_success: user_id=%s company_id=%s", getattr(current_user, "user_id", None), company_id)
        return {"message": "Profile updated successfully"}

    logger.warning("update_profile_me_invalid_type: user_id=%s user_type=%s", getattr(current_user, "user_id", None), getattr(current_user, "user_type", None))
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user type")


def get_profile_by_user_id_controller(
    db: Session, *, user_id: UUID
) -> Union[UserProfileApplicantResponse, UserProfileRecruiterResponse]:
    logger.debug("get_profile_by_user_id_request: user_id=%s", user_id)
    user = user_repo.get_user_by_id(db, user_id)
    if not user:
        logger.warning("get_profile_by_user_id_not_found: user_id=%s", user_id)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if user.user_type == "applicant":
        applicant = user_repo.get_applicant_by_user_id(db, user.user_id)
        logger.info("get_profile_by_user_id_applicant_success: user_id=%s", user_id)
        return _build_applicant_response(user, applicant)
    elif user.user_type == "recruiter":
        recruiter = get_recruiter_by_user_id(db, user.user_id)
        logger.info("get_profile_by_user_id_recruiter_success: user_id=%s", user_id)
        return _build_recruiter_response(user, recruiter)

    logger.warning("get_profile_by_user_id_profile_not_found: user_id=%s", user_id)
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User profile not found")
