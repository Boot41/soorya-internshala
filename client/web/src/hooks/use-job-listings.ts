import { useQuery } from "@tanstack/react-query"
import { listJobListings } from "@/api/job-listing"
import type { JobListing } from "@/types/job-listing"

export function useJobListings(params?: { companyId?: string; limit?: number }) {
  const query = useQuery<JobListing[], Error>({
    queryKey: ["job-listings", params ?? {}],
    queryFn: () => listJobListings(params),
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
