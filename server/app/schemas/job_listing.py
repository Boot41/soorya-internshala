from datetime import datetime
from typing import Optional, Literal
from uuid import UUID as UUIDType

from pydantic import BaseModel


JobType = Literal["full-time", "part-time", "internship", "contract"]
JobStatus = Literal["open", "closed", "draft"]


class JobListingBase(BaseModel):
    title: str
    description: str
    requirements: str
    skills_required: Optional[str] = None
    location: str
    experience_level: Optional[str] = None
    job_type: JobType
    salary_range: Optional[str] = None
    expires_at: Optional[datetime] = None
    status: JobStatus = "open"


class JobListingCreate(JobListingBase):
    company_id: UUIDType


class JobListingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[str] = None
    skills_required: Optional[str] = None
    location: Optional[str] = None
    experience_level: Optional[str] = None
    job_type: Optional[JobType] = None
    salary_range: Optional[str] = None
    expires_at: Optional[datetime] = None
    status: Optional[JobStatus] = None


class JobListingResponse(JobListingBase):
    job_id: UUIDType
    company_id: UUIDType
    recruiter_id: UUIDType
    posted_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
