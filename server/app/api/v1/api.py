from fastapi import APIRouter

from app.api.v1.endpoints import auth, companies, user, files, job_listings, recruiter, applications

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(companies.router, prefix="/companies", tags=["companies"])
api_router.include_router(user.router, prefix="/users", tags=["users"])
api_router.include_router(files.router, prefix="/files", tags=["files"])
api_router.include_router(job_listings.router, prefix="/job-listings", tags=["job_listings"])
api_router.include_router(recruiter.router, prefix="/recruiter", tags=["recruiter"])
api_router.include_router(applications.router, prefix="/applications", tags=["applications"])
