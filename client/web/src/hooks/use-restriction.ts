import { useEffect, useMemo } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useUserStore } from "@/store/user"
import { toast } from "sonner"

export type AllowedUserType = "applicant" | "recruiter"

/**
 * Ensures the current user's type matches the required type.
 * If it does not, redirects to the provided route or "/" by default.
 *
 * Usage:
 *   useRequireUserType("applicant")
 *   useRequireUserType("recruiter", "/dashboard")
 */
export function useRestriction(
  required: AllowedUserType,
  redirectTo?: Parameters<ReturnType<typeof useNavigate>>[0]["to"]
) {
  const navigate = useNavigate()
  const userType = useUserStore((s) => s.userType)

  const canAccess = useMemo(() => {
    if (!userType) return undefined // unknown yet
    return userType === required
  }, [userType, required])

  useEffect(() => {
    if (canAccess === false) {
      toast.warning("You are not authorized to access this page")
      navigate({ to: (redirectTo ?? "/") })
    }
  }, [canAccess, navigate, redirectTo])
}
