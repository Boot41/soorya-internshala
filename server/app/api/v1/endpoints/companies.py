from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_recruiter
from app.db.session import get_db
from app.controllers import company as company_controller
from app.schemas.company import CompanyCreate, CompanyUpdate, CompanyResponse

router = APIRouter()


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_company(
    company_in: CompanyCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_recruiter),
):
    company = company_controller.create_company(
        db, recruiter_user_id=current_user.user_id, company_in=company_in
    )
    return {"message": "Company profile created successfully", "company_id": company.company_id}


@router.get("/{company_id}", response_model=CompanyResponse)
def get_company(company_id: UUID, db: Session = Depends(get_db)):
    company = company_controller.get_company(db, company_id)
    if not company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
    return company


@router.put("/{company_id}")
def update_company(
    company_id: UUID,
    company_update: CompanyUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_recruiter),
):
    company = company_controller.get_company(db, company_id)
    if not company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")

    recruiter = company_controller.get_recruiter_by_user_id(db, current_user.user_id)
    if not recruiter or recruiter.company_id != company.company_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this company")

    updated = company_controller.update_company(db, company=company, update_data=company_update.dict(exclude_unset=True))
    return {"message": "Company profile updated successfully"}
