from sqlalchemy.orm import Session

from app.repository.dashboard import get_recruiter_dashboard_stats
from app.repository.company import get_recruiter_by_user_id
from app.schemas.dashboard import RecruiterDashboardStats
from fastapi import HTTPException, status


def get_recruiter_dashboard_stats_controller(db: Session, *, current_user) -> RecruiterDashboardStats:
    # Ensure the user is a recruiter and has a recruiter profile
    recruiter = get_recruiter_by_user_id(db, current_user.user_id)
    if not recruiter:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Recruiter profile not found")

    data = get_recruiter_dashboard_stats(db, recruiter_id=recruiter.recruiter_id)
    return RecruiterDashboardStats(**data)
