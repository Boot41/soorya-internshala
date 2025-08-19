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
