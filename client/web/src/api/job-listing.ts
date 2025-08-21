import api from "@/api/client"
import { getErrorMessage } from "@/utils/error"
import type { JobListingRequestPayload, JobListingUpdatePayload, JobListing } from "@/types/job-listing"

export interface CreateJobListingResponse {
  message: string
  job_id: string
}

export async function createJobListing(payload: JobListingRequestPayload): Promise<CreateJobListingResponse> {
  try {
    const { data } = await api.post<CreateJobListingResponse>("/job-listings/", payload)
    return data
  } catch (err) {
    console.error("[createJobListing]", err)
    throw new Error(getErrorMessage(err))
  }
}

export async function getJobListing(jobId: string): Promise<JobListing> {
  try {
    const { data } = await api.get<JobListing>(`/job-listings/${jobId}`)
    return data
  } catch (err) {
    console.error("[getJobListing]", err)
    throw new Error(getErrorMessage(err))
  }
}

export interface UpdateJobListingResponse {
  message: string
}

export async function updateJobListing(jobId: string, payload: JobListingUpdatePayload): Promise<UpdateJobListingResponse> {
  try {
    const { data } = await api.put<UpdateJobListingResponse>(`/job-listings/${jobId}`, payload)
    return data
  } catch (err) {
    console.error("[updateJobListing]", err)
    throw new Error(getErrorMessage(err))
  }
}
