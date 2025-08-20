
from sqlalchemy import Column, String, DateTime, Enum, ForeignKey, Text, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid

from app.db.session import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(UUID(as_uuid=True), primary_key=True, unique=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    user_type = Column(Enum('applicant', 'recruiter', name='user_type_enum'), nullable=False)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())

class Applicant(Base):
    __tablename__ = "applicants"

    applicant_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id'), primary_key=True)
    headline = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    resume_url = Column(String, nullable=True)
    experience = Column(JSON, nullable=True)
    education = Column(JSON, nullable=True)
    profile_picture_url = Column(String, nullable=True)
    updated_at = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())

class Company(Base):
    __tablename__ = "companies"

    company_id = Column(UUID(as_uuid=True), primary_key=True, unique=True, default=uuid.uuid4)
    name = Column(String, unique=True, nullable=False)
    description = Column(Text, nullable=True)
    website_url = Column(String, nullable=True)
    logo_url = Column(String, nullable=True)
    industry = Column(String, nullable=True)
    headquarters = Column(String, nullable=True)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())

class Recruiter(Base):
    __tablename__ = "recruiters"

    recruiter_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id'), primary_key=True)
    company_id = Column(UUID(as_uuid=True), ForeignKey('companies.company_id'), nullable=False)
    updated_at = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())
