from uuid import UUID
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.db.models import Company, Recruiter
from app.schemas.company import CompanyCreate


def get_company(db: Session, company_id: UUID) -> Company | None:
    return db.query(Company).filter(Company.company_id == company_id).first()


def list_companies(db: Session) -> list[Company]:
    return db.query(Company).order_by(Company.name.asc()).all()


def get_recruiter_by_user_id(db: Session, user_id: UUID) -> Recruiter | None:
    return db.query(Recruiter).filter(Recruiter.recruiter_id == user_id).first()


def create_company(db: Session, *, recruiter_user_id: UUID, company_in: CompanyCreate) -> Company:
    existing = db.query(Company).filter(Company.name == company_in.name).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Company name already exists")

    company = Company(
        name=company_in.name,
        description=company_in.description,
        website_url=str(company_in.website_url) if company_in.website_url else None,
        logo_url=str(company_in.logo_url) if company_in.logo_url else None,
        industry=company_in.industry,
        headquarters=company_in.headquarters,
    )
    db.add(company)
    db.flush()  # get company_id

    # Link recruiter to company (create or update association)
    recruiter = get_recruiter_by_user_id(db, recruiter_user_id)
    if recruiter:
        recruiter.company_id = company.company_id
    else:
        recruiter = Recruiter(recruiter_id=recruiter_user_id, company_id=company.company_id)
        db.add(recruiter)

    db.commit()
    db.refresh(company)
    return company


def update_company(db: Session, *, company: Company, update_data: dict) -> Company:
    for field, value in update_data.items():
        if not hasattr(company, field):
            continue
        # Normalize URL types coming from Pydantic (e.g., HttpUrl)
        if field in {"website_url", "logo_url"}:
            # Accept empty string as None, otherwise cast to str
            if value == "":
                value = None
            elif value is not None:
                value = str(value)
        if value is not None:
            setattr(company, field, value)
    db.add(company)
    db.commit()
    db.refresh(company)
    return company
