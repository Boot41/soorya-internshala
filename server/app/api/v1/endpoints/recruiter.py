from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import require_recruiter
from app.db.session import get_db
from app.controllers.recruiter_dashboard import get_recruiter_dashboard_stats_controller
from app.schemas.recruiter_dashboard import RecruiterDashboardStats

router = APIRouter()


@router.get("/dashboard/stats",  response_model=RecruiterDashboardStats)
def get_dashboard_stats(current_user=Depends(require_recruiter), db: Session = Depends(get_db)):
    return get_recruiter_dashboard_stats_controller(db, current_user=current_user)
