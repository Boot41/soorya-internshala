import { useQuery } from "@tanstack/react-query"
import { getApplicantMe } from "@/api/applicant"
import type { UserProfileApplicantResponse } from "@/types/applicant"

export function useApplicant() {
  const query = useQuery<UserProfileApplicantResponse, Error>({
    queryKey: ["applicant", "me"],
    queryFn: getApplicantMe,
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
