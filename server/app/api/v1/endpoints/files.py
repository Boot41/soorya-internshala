from fastapi import APIRouter, UploadFile, File, HTTPException, status, Depends
from sqlalchemy.orm import Session

from app.controllers.files import save_uploaded_file
from app.db.session import get_db
from app.api.deps import get_current_user, require_recruiter

router = APIRouter()


@router.post("/upload/resume")
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    try:
        url = await save_uploaded_file(file, file_type="resume", db=db, current_user=current_user)
        return {"url": url}
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to upload resume")


@router.post("/upload/profile")
async def upload_profile_picture(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    try:
        url = await save_uploaded_file(file, file_type="profile", db=db, current_user=current_user)
        return {"url": url}
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to upload profile picture")


@router.post("/upload/logo")
async def upload_company_logo(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(require_recruiter),
):
    try:
        url = await save_uploaded_file(file, file_type="logo", db=db, current_user=current_user)
        return {"url": url}
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to upload company logo")
