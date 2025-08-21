#!/usr/bin/env python3
"""
Seed the database with sample companies, recruiters, and job postings.
- 10 Companies
- 10 Recruiters (1 per company)
- 30 Job Postings distributed across companies/recruiters

Idempotency: if any companies already exist, the script aborts to avoid duplicate inserts.
Run: python server/scripts/seed.py
"""
from __future__ import annotations

from typing import List
import random
import sys
from pathlib import Path

# Ensure the project root (server directory) is on sys.path so `app.*` imports work
ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.append(str(ROOT_DIR))

from sqlalchemy.orm import Session
from sqlalchemy import select, func

from app.db.session import SessionLocal
from app.db.models import User, Company, Recruiter, JobPosting


COMPANIES = [
    {
        "name": "Acme Corp",
        "description": "Innovative solutions across industries.",
        "website_url": "https://www.acme.example",
        "logo_url": "https://placehold.co/128x128?text=Acme",
        "industry": "Technology",
        "headquarters": "San Francisco, CA",
    },
    {
        "name": "Globex",
        "description": "Global logistics and supply chain optimization.",
        "website_url": "https://www.globex.example",
        "logo_url": "https://placehold.co/128x128?text=Globex",
        "industry": "Logistics",
        "headquarters": "Chicago, IL",
    },
    {
        "name": "Initech",
        "description": "Enterprise software and consulting.",
        "website_url": "https://www.initech.example",
        "logo_url": "https://placehold.co/128x128?text=Initech",
        "industry": "Software",
        "headquarters": "Austin, TX",
    },
    {
        "name": "Umbrella Health",
        "description": "Healthcare research and pharmaceuticals.",
        "website_url": "https://www.umbrella.example",
        "logo_url": "https://placehold.co/128x128?text=Umbrella",
        "industry": "Healthcare",
        "headquarters": "Boston, MA",
    },
    {
        "name": "Soylent Foods",
        "description": "Next-gen nutrition and sustainable food.",
        "website_url": "https://www.soylent.example",
        "logo_url": "https://placehold.co/128x128?text=Soylent",
        "industry": "Food & Beverage",
        "headquarters": "Los Angeles, CA",
    },
    {
        "name": "Wayne Enterprises",
        "description": "Diversified industrial conglomerate.",
        "website_url": "https://www.wayne.example",
        "logo_url": "https://placehold.co/128x128?text=Wayne",
        "industry": "Industrial",
        "headquarters": "Gotham City",
    },
    {
        "name": "Stark Industries",
        "description": "Cutting-edge tech and clean energy.",
        "website_url": "https://www.stark.example",
        "logo_url": "https://placehold.co/128x128?text=Stark",
        "industry": "Aerospace & Energy",
        "headquarters": "Malibu, CA",
    },
    {
        "name": "Hooli",
        "description": "Internet platform and mobile innovation.",
        "website_url": "https://www.hooli.example",
        "logo_url": "https://placehold.co/128x128?text=Hooli",
        "industry": "Internet",
        "headquarters": "Palo Alto, CA",
    },
    {
        "name": "Cyberdyne Systems",
        "description": "Robotics and AI solutions.",
        "website_url": "https://www.cyberdyne.example",
        "logo_url": "https://placehold.co/128x128?text=Cyberdyne",
        "industry": "Robotics",
        "headquarters": "San Jose, CA",
    },
    {
        "name": "Black Mesa",
        "description": "Advanced research and materials science.",
        "website_url": "https://www.blackmesa.example",
        "logo_url": "https://placehold.co/128x128?text=BlackMesa",
        "industry": "Research",
        "headquarters": "New Mexico",
    },
]

CITIES = [
    "San Francisco, CA",
    "New York, NY",
    "Seattle, WA",
    "Austin, TX",
    "Boston, MA",
    "Los Angeles, CA",
]

TITLES = [
    "Software Engineer",
    "Backend Developer",
    "Frontend Developer",
    "Data Scientist",
    "DevOps Engineer",
    "Product Manager",
]

JOB_TYPES = ["full-time", "part-time", "internship", "contract"]
STATUSES = ["open", "open", "open", "draft", "closed"]  # skew to open
EXPERIENCE = ["Junior", "Mid", "Senior"]


def seed(db: Session) -> None:
    # Abort if companies already exist
    has_companies = db.execute(select(func.count(Company.company_id))).scalar() or 0
    if has_companies:
        print("Seed aborted: companies already exist.")
        return

    # Create companies
    companies: List[Company] = []
    for c in COMPANIES:
        company = Company(
            name=c["name"],
            description=c["description"],
            website_url=c["website_url"],
            logo_url=c["logo_url"],
            industry=c["industry"],
            headquarters=c["headquarters"],
        )
        db.add(company)
        companies.append(company)
    db.flush()  # assign IDs

    # Create recruiters (users + recruiter rows), one per company
    recruiters: List[Recruiter] = []
    for idx, company in enumerate(companies):
        email = f"recruiter{idx+1}@example.com"
        user = User(
            email=email,
            password_hash="testpasswordhash",
            first_name=f"Recruiter{idx+1}",
            last_name="User",
            user_type="recruiter",
        )
        db.add(user)
        db.flush()  # get user_id

        recruiter = Recruiter(
            recruiter_id=user.user_id,
            company_id=company.company_id,
        )
        db.add(recruiter)
        recruiters.append(recruiter)
    db.flush()

    # Create 30 job postings distributed across companies/recruiters
    postings: List[JobPosting] = []
    for i in range(30):
        company = random.choice(companies)
        # find recruiter tied to this company
        recruiter = next((r for r in recruiters if r.company_id == company.company_id), random.choice(recruiters))
        title = f"{random.choice(TITLES)} {random.choice(['I','II','III'])}"
        exp = random.choice(EXPERIENCE)
        job_type = random.choice(JOB_TYPES)
        status = random.choice(STATUSES)
        city = random.choice(CITIES)
        skills = random.sample(["Python", "Go", "Java", "React", "SQL", "AWS", "Docker", "Kubernetes"], k=3)

        posting = JobPosting(
            company_id=company.company_id,
            recruiter_id=recruiter.recruiter_id,
            title=title,
            description=f"We are seeking a {title} to join our {company.name} team.",
            requirements=f"{exp} level experience required. Strong problem solving skills.",
            skills_required=", ".join(skills),  # TEXT field per model
            location=city,
            experience_level=exp,
            job_type=job_type,  # enum values per model
            salary_range=random.choice(["$80k-$120k", "$120k-$160k", "$60k-$90k"]),
            status=status,  # enum values per model
        )
        db.add(posting)
        postings.append(posting)

    db.commit()
    print(f"Seed complete: {len(companies)} companies, {len(recruiters)} recruiters, {len(postings)} job postings.")


def main() -> None:
    db = SessionLocal()
    try:
        seed(db)
    finally:
        db.close()


if __name__ == "__main__":
    main()
