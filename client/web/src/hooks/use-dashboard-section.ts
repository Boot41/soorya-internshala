import { useQuery } from "@tanstack/react-query"
import api from "@/api/client"
import type { RecruiterDashboardStats } from "@/types/recruiter"

async function fetchRecruiterDashboardStats() {
  const { data } = await api.get<RecruiterDashboardStats>("/recruiter/dashboard/stats")
  return data
}

export function useDashboardSection() {
  const query = useQuery<RecruiterDashboardStats, Error, RecruiterDashboardStats, ["recruiter-dashboard-stats"]>({
    queryKey: ["recruiter-dashboard-stats"],
    queryFn: fetchRecruiterDashboardStats,
    staleTime: 60_000,
  })

  return {
    ...query,
    stats: query.data,
  }
}
