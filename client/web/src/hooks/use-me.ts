import { useQuery } from "@tanstack/react-query"
import {  type UserMeResponse } from "@/types/user"
import { getMe } from "@/api/user"

export function useMe() {
  const query = useQuery<UserMeResponse, Error>({
    queryKey: ["me"],
    queryFn: getMe,
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
