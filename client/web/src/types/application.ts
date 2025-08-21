export type ApplicationStatus = "applied" | "under review" | "shortlisted" | "rejected" | "hired"

export type JobApplicationItem = {
  application_id: string
  applicant_id: string
  applicant_name: string
  applicant_email: string
  resume_url: string | null
  status: ApplicationStatus
}

export type MyApplicationItem = {
  application_id: string
  status: ApplicationStatus
  job_id: string
  job_title: string
  job_type: "full-time" | "part-time" | "internship" | "contract"
  job_location: string
  company_id: string
  company_name: string
}