from pydantic import BaseModel
from typing import Optional, Literal
from uuid import UUID


class ApplyRequest(BaseModel):
    cover_letter: Optional[str] = None


class ApplyResponse(BaseModel):
    message: str
    application_id: UUID


class ApplicationStatusResponse(BaseModel):
    has_applied: bool
    application_id: Optional[UUID] = None
    status: Optional[str] = None


class ApplicationListItem(BaseModel):
    application_id: UUID
    applicant_id: UUID
    applicant_name: str
    applicant_email: str
    resume_url: Optional[str] = None
    status: Literal["applied", "under review", "shortlisted", "rejected", "hired"]


class UpdateApplicationStatusRequest(BaseModel):
    status: Literal["applied", "under review", "shortlisted", "rejected", "hired"]


class UpdateApplicationStatusResponse(BaseModel):
    message: str


class MyApplicationListItem(BaseModel):
    application_id: UUID
    status: Literal["applied", "under review", "shortlisted", "rejected", "hired"]
    job_id: UUID
    job_title: str
    job_type: Literal["full-time", "part-time", "internship", "contract"]
    job_location: str
    company_id: UUID
    company_name: str
