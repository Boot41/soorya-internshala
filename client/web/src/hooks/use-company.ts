import { useQuery } from "@tanstack/react-query"
import { getCompany} from "@/api/company"
import type { Company } from "@/types/company"

export function useCompany(companyId: string) {
  const query = useQuery<Company, Error>({
    queryKey: ["company", companyId],
    queryFn: () => getCompany(companyId),
    enabled: !!companyId,
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
