import { useQuery } from "@tanstack/react-query"
import { listCompanies } from "@/api/company"
import type { Company } from "@/types/company"

export function useCompanies() {
  const query = useQuery<Company[], Error>({
    queryKey: ["companies"],
    queryFn: listCompanies,
  })

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
