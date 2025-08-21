from pydantic import BaseModel

class RecruiterDashboardStats(BaseModel):
    total_jobs: int
    total_open_jobs: int
    total_draft_jobs: int
    total_applications: int
