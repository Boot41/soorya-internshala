import { useQuery } from "@tanstack/react-query"
import { getApplicantById } from "@/api/applicant"
import type { UserProfileApplicantResponse } from "@/types/applicant"

export function useApplicantById(applicantId: string) {
  const query = useQuery<UserProfileApplicantResponse, Error>({
    queryKey: ["applicant", applicantId],
    queryFn: () => getApplicantById(applicantId),
    enabled: !!applicantId,
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
