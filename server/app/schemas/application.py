from pydantic import BaseModel
from typing import Optional
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
