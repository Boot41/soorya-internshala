import { useEffect, useState } from "react"
import type { JobListingsFeedParams, UseJobFiltersReturn } from "@/types/job-listing"
import { useDebounce } from "@/hooks/use-debounce"


export function useJobFilters(initial?: Partial<JobListingsFeedParams>): UseJobFiltersReturn {
  const [params, setParams] = useState<JobListingsFeedParams>({
    sort_by: initial?.sort_by ?? "posted_at",
    sort_order: initial?.sort_order ?? "desc",
    limit: initial?.limit ?? 20,
    q: initial?.q,
    location: initial?.location,
    job_type: initial?.job_type,
    experience_level: initial?.experience_level,
    status: initial?.status,
    company_id: initial?.company_id,
  })

  // local search input (debounced to params.q)
  const [localQ, setLocalQ] = useState<string>(params.q ?? "")
  const debouncedQ = useDebounce(localQ, 300)

  // keep local input in sync when params.q changes externally
  useEffect(() => {
    setLocalQ(params.q ?? "")
  }, [params.q])

  // propagate debounced input to filter params
  useEffect(() => {
    if ((params.q ?? "") !== debouncedQ) {
      setParams({ ...params, q: debouncedQ || undefined })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ])

  const onChange = (next: JobListingsFeedParams) => setParams(next)

  const reset = () => {
    setParams({
      q: undefined,
      location: undefined,
      job_type: undefined,
      experience_level: undefined,
      sort_by: params.sort_by ?? "posted_at",
      sort_order: params.sort_order ?? "desc",
      limit: params.limit ?? 20,
      status: params.status,
      company_id: params.company_id,
    })
    setLocalQ("")
  }

  return {
    params,
    setParams,
    value: params,
    onChange,
    reset,
    searchValue: localQ,
    onSearchChange: setLocalQ,
  }
}
