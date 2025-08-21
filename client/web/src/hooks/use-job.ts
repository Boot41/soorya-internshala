import { useQuery } from "@tanstack/react-query"
import { getJobListing } from "@/api/job-listing"
import type { JobListing } from "@/types/job-listing"

export function useJob(jobId: string) {
  const query = useQuery<JobListing, Error>({
    queryKey: ["job-listing", jobId],
    queryFn: () => getJobListing(jobId),
    enabled: !!jobId,
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
