import { useEffect, useMemo } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useUserStore } from "@/store/user"
import { toast } from "sonner"
import { useAuthStore } from "@/store/auth"

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
  required?: AllowedUserType,
  redirectTo: Parameters<ReturnType<typeof useNavigate>>[0]["to"] = "/"
) {
  const navigate = useNavigate()
  const userType = useUserStore((s) => s.userType)
  const accessToken = useAuthStore((s) => s.accessToken)

  const canAccess = useMemo(() => {
    // Public route that only requires authentication
    if (!required) return !!accessToken

    // If no token at all, definitely cannot access
    if (!accessToken) return false

    // Token present but userType not yet hydrated -> indeterminate; don't redirect yet
    if (!userType) return undefined as unknown as boolean

    // Token present and userType known
    return userType === required
  }, [userType, required, accessToken])

  useEffect(() => {
    // Only redirect on definitive denial, avoid redirecting while state is indeterminate
    if (canAccess === false) {
      toast.warning("You are not authorized to access this page")
      navigate({ to: redirectTo })
    }
  }, [canAccess, navigate, redirectTo])
}
