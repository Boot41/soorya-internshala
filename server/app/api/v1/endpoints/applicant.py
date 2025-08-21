from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import require_applicant
from app.db.session import get_db
from app.controllers.application import list_my_applications_controller
from app.schemas.application import MyApplicationListItem

router = APIRouter()


@router.get("/applications", response_model=List[MyApplicationListItem])
def list_my_applications(current_user=Depends(require_applicant), db: Session = Depends(get_db)):
    return list_my_applications_controller(db, current_user=current_user)
