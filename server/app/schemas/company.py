from typing import Optional
from uuid import UUID as UUIDType
from pydantic import BaseModel, HttpUrl


class CompanyBase(BaseModel):
    name: str
    description: Optional[str] = None
    website_url: Optional[HttpUrl] = None
    logo_url: Optional[HttpUrl] = None
    industry: Optional[str] = None
    headquarters: Optional[str] = None


class CompanyCreate(CompanyBase):
    pass


class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    website_url: Optional[HttpUrl] = None
    logo_url: Optional[HttpUrl] = None
    industry: Optional[str] = None
    headquarters: Optional[str] = None


class CompanyResponse(CompanyBase):
    company_id: UUIDType

    class Config:
        from_attributes = True
