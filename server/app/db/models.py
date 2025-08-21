
from sqlalchemy import Column, String, DateTime, Enum, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
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
    experience = Column(JSONB, nullable=True)
    education = Column(JSONB, nullable=True)
    skills = Column(JSONB, nullable=True)
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


class JobPosting(Base):
    __tablename__ = "job_postings"

    job_id = Column(UUID(as_uuid=True), primary_key=True, unique=True, default=uuid.uuid4)
    company_id = Column(UUID(as_uuid=True), ForeignKey('companies.company_id'), nullable=False)
    recruiter_id = Column(UUID(as_uuid=True), ForeignKey('recruiters.recruiter_id'), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    requirements = Column(Text, nullable=False)
    # Keeping as TEXT to match architecture.md (can later switch to JSONB if desired)
    skills_required = Column(Text, nullable=True)
    location = Column(String, nullable=False)
    experience_level = Column(String, nullable=True)
    job_type = Column(Enum('full-time', 'part-time', 'internship', 'contract', name='job_type_enum'), nullable=False)
    salary_range = Column(String, nullable=True)
    posted_at = Column(DateTime, nullable=False, default=func.now())
    expires_at = Column(DateTime, nullable=True)
    status = Column(Enum('open', 'closed', 'draft', name='job_status_enum'), nullable=False)
    updated_at = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())


class Application(Base):
    __tablename__ = "applications"

    application_id = Column(UUID(as_uuid=True), primary_key=True, unique=True, default=uuid.uuid4)
    job_id = Column(UUID(as_uuid=True), ForeignKey('job_postings.job_id'), nullable=False)
    applicant_id = Column(UUID(as_uuid=True), ForeignKey('applicants.applicant_id'), nullable=False)
    applied_at = Column(DateTime, nullable=False, default=func.now())
    status = Column(Enum('applied', 'under review', 'shortlisted', 'rejected', 'hired', name='application_status_enum'), nullable=False)
    cover_letter = Column(Text, nullable=True)
    updated_at = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())
