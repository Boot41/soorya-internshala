import api from "@/api/client"
import { getErrorMessage } from "@/utils/error"
import type { JobListingRequestPayload, JobListingUpdatePayload, JobListing, ApplicationStatusResponse, CreateJobListingResponse, JobListingsFeedParams, JobListingsFeedResponse } from "@/types/job-listing"


export async function fetchJobListingsFeed({
  pageParam,
  params,
}: {
  pageParam?: string | null
  params: JobListingsFeedParams
}): Promise<JobListingsFeedResponse> {
  const { data } = await api.get<JobListingsFeedResponse>("/job-listings/feed", {
    params: {
      ...params,
      cursor: pageParam ?? undefined,
    },
  })
  return data
}


export async function getMyApplicationStatus(jobId: string): Promise<ApplicationStatusResponse> {
  try {
    const { data } = await api.get<ApplicationStatusResponse>(`/job-listings/${jobId}/application/me`)
    return data
  } catch (err) {
    console.error("[getMyApplicationStatus]", err)
    throw new Error(getErrorMessage(err))
  }
}

export interface ApplyToJobPayload {
  cover_letter?: string
}

export interface ApplyToJobResponse {
  message: string
  application_id: string
}

export async function applyToJob(jobId: string, payload?: ApplyToJobPayload): Promise<ApplyToJobResponse> {
  try {
    const { data } = await api.post<ApplyToJobResponse>(`/job-listings/${jobId}/apply`, payload ?? {})
    return data
  } catch (err) {
    console.error("[applyToJob]", err)
    throw new Error(getErrorMessage(err))
  }
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

export async function listJobListings(params?: { companyId?: string; limit?: number }): Promise<JobListing[]> {
  try {
    const search = new URLSearchParams()
    if (params?.companyId) search.set("company_id", params.companyId)
    if (typeof params?.limit === 'number') search.set("limit", String(params.limit))
    const qs = search.toString()
    const { data } = await api.get<JobListing[]>(`/job-listings/${qs ? `?${qs}` : ''}`)
    return data
  } catch (err) {
    console.error("[listJobListings]", err)
    throw new Error(getErrorMessage(err))
  }
}
