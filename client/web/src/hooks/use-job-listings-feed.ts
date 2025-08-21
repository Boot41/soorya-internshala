import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query"
import api from "@/api/client"
import type { JobListingsFeedParams, JobListingsFeedResponse } from "@/types/job-listing"



async function fetchJobListingsFeed({
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

export function useJobListingsFeed(params: JobListingsFeedParams) {
  const query = useInfiniteQuery<
    JobListingsFeedResponse,
    Error,
    JobListingsFeedResponse,
    ["job-listings-feed", JobListingsFeedParams]
  >({
    queryKey: ["job-listings-feed", params],
    queryFn: ({ pageParam }) =>
      fetchJobListingsFeed({ pageParam: pageParam as string | null | undefined, params }),
    getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
    initialPageParam: undefined,
  })

  const items = (
    (query.data as InfiniteData<JobListingsFeedResponse> | undefined)?.pages?.flatMap(
      (p: JobListingsFeedResponse) => p.items,
    ) ?? []
  )

  return {
    ...query,
    items,
  }
}
