from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import require_recruiter
from app.db.session import get_db
from app.repository import company as company_repository
from app.schemas.company import CompanyCreate, CompanyUpdate, CompanyResponse

router = APIRouter()


@router.get("/", response_model=list[CompanyResponse])
def list_companies(db: Session = Depends(get_db)):
    return company_repository.list_companies(db)


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_company(
    company_in: CompanyCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_recruiter),
):
    company = company_repository.create_company(
        db, recruiter_user_id=current_user.user_id, company_in=company_in
    )
    return {"message": "Company profile created successfully", "company_id": company.company_id}


@router.get("/{company_id}", response_model=CompanyResponse)
def get_company(company_id: UUID, db: Session = Depends(get_db)):
    company = company_repository.get_company(db, company_id)
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
    company = company_repository.update_company(db, company_id, company_update, current_user)
    return {"message": "Company profile updated successfully", "company": company}
