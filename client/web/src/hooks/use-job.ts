import { useMutation, useQuery } from "@tanstack/react-query"
import { applyToJob, getJobListing, getMyApplicationStatus, type ApplyToJobPayload } from "@/api/job-listing"
import type { JobListing } from "@/types/job-listing"
import { toast } from "sonner"
import { useUserStore } from "@/store/user"

export function useJob(jobId: string) {
  const query = useQuery<JobListing, Error>({
    queryKey: ["job-listing", jobId],
    queryFn: () => getJobListing(jobId),
    enabled: !!jobId,
  })

  const isApplicant = useUserStore((s) => s.userType) === "applicant"

  const statusQuery = useQuery({
    queryKey: ["job-application-status", jobId],
    queryFn: () => getMyApplicationStatus(jobId),
    enabled: !!jobId && isApplicant,
  })

  const { mutateAsync: apply, isPending: isApplying } = useMutation({
    mutationFn: (payload: ApplyToJobPayload | undefined) => applyToJob(jobId, payload),
    onSuccess: (data) => {
      toast.success(data?.message ?? "Applied successfully")
      // Refresh application status after a successful apply
      statusQuery.refetch()
    },
    onError: (err) => {
      toast.error(err?.message ?? "Failed to apply")
    },
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    apply,
    isApplying,
    hasApplied: statusQuery.data?.has_applied === true,
    applicationStatus: statusQuery.data?.status ?? null,
  }
}
