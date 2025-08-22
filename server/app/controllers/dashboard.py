import logging
from sqlalchemy.orm import Session

from app.repository.dashboard import get_recruiter_dashboard_stats
from app.repository.company import get_recruiter_by_user_id
from app.schemas.dashboard import RecruiterDashboardStats
from fastapi import HTTPException, status

logger = logging.getLogger("app.controllers.dashboard")


def get_recruiter_dashboard_stats_controller(db: Session, *, current_user) -> RecruiterDashboardStats:
    logger.debug(
        "recruiter_dashboard_request: user_id=%s",
        getattr(current_user, "user_id", None),
    )
    # Ensure the user is a recruiter and has a recruiter profile
    recruiter = get_recruiter_by_user_id(db, current_user.user_id)
    if not recruiter:
        logger.warning(
            "recruiter_dashboard_forbidden: user_id=%s",
            getattr(current_user, "user_id", None),
        )
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Recruiter profile not found")

    data = get_recruiter_dashboard_stats(db, recruiter_id=recruiter.recruiter_id)
    logger.info(
        "recruiter_dashboard_success: recruiter_id=%s",
        getattr(recruiter, "recruiter_id", None),
    )
    return RecruiterDashboardStats(**data)
