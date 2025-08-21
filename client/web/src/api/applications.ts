import api from "@/api/client"
import type { ApplicationStatus, JobApplicationItem, MyApplicationItem } from "@/types/application"
import { getErrorMessage } from "@/utils/error"


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
