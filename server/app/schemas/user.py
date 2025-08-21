from pydantic import BaseModel, EmailStr
from uuid import UUID
from app.constants.user_types import UserType


class UserBase(BaseModel):
    email: EmailStr
    user_type: UserType


class UserCreate(UserBase):
    password: str
    first_name: str
    last_name: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class UserInDBBase(UserBase):
    user_id: UUID
    # created_at: datetime
    # updated_at: datetime

    class Config:
        from_attributes = True


class User(UserInDBBase):
    pass


class UserRegisterResponse(BaseModel):
    message: str
    user_id: UUID

from typing import Optional, List
from pydantic import HttpUrl


class ExperienceItem(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None


class EducationItem(BaseModel):
    degree: Optional[str] = None
    university: Optional[str] = None


class UserProfileApplicantResponse(BaseModel):
    user_id: UUID
    email: EmailStr
    user_type: UserType
    first_name: str
    last_name: str
    headline: Optional[str] = None
    bio: Optional[str] = None
    resume_url: Optional[HttpUrl] = None
    experience: List[ExperienceItem] = []
    education: List[EducationItem] = []
    profile_picture_url: Optional[HttpUrl] = None
    skills: List[str] = []


class UserProfileRecruiterResponse(BaseModel):
    user_id: UUID
    email: EmailStr
    user_type: UserType
    first_name: str
    last_name: str
    company_id: Optional[UUID] = None


class UpdateUserProfile(BaseModel):
    headline: Optional[str] = None
    bio: Optional[str] = None
    resume_url: Optional[HttpUrl] = None
    experience: Optional[List[ExperienceItem]] = None
    education: Optional[List[EducationItem]] = None
    profile_picture_url: Optional[HttpUrl] = None
    company_id: Optional[UUID] = None
    skills: Optional[List[str]] = None
