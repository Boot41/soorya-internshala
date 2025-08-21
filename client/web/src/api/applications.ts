import api from "@/api/client"
import { getErrorMessage } from "@/utils/error"

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

export async function listMyApplications(): Promise<MyApplicationItem[]> {
  try {
    const { data } = await api.get<MyApplicationItem[]>(`/applicant/applications`)
    return data
  } catch (err) {
    console.error("[listMyApplications]", err)
    throw new Error(getErrorMessage(err))
  }
}

export async function listApplicationsByJob(jobId: string): Promise<JobApplicationItem[]> {
  try {
    // NOTE: Server endpoint not present yet; expected endpoint proposal
    // e.g., GET /jobs/{job_id}/applications or /applications?job_id=
    const { data } = await api.get<JobApplicationItem[]>(`/applications`, { params: { job_id: jobId } })
    return data
  } catch (err) {
    console.error("[listApplicationsByJob]", err)
    throw new Error(getErrorMessage(err))
  }
}

export async function updateApplicationStatus(applicationId: string, status: ApplicationStatus): Promise<{ message: string }>{
  try {
    // NOTE: Server endpoint not present yet; expected endpoint proposal
    // e.g., PATCH /applications/{application_id}
    const { data } = await api.patch<{ message: string }>(`/applications/${applicationId}`, { status })
    return data
  } catch (err) {
    console.error("[updateApplicationStatus]", err)
    throw new Error(getErrorMessage(err))
  }
}
