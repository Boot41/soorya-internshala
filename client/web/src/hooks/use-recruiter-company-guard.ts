import { useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { getMe } from "@/api/user"
import { useUserStore } from "@/store/user"
import { useAuthStore } from "@/store/auth"

/**
 * Ensures that a recruiter is associated with a company.
 * If not, redirects to /company with an error toast.
 */
export function useRecruiterCompanyGuard() {
  const navigate = useNavigate()
  const userType = useUserStore((s) => s.userType)
  const accessToken = useAuthStore((s) => s.accessToken)

  const { mutateAsync: fetchMe } = useMutation({
    mutationKey: ["users", "me", "guard"],
    mutationFn: () => getMe(),
  })

  useEffect(() => {
    // Only run when authenticated and known recruiter
    if (!accessToken || userType !== "recruiter") return

    fetchMe().then((me: any) => {
      if (!me?.company_id) {
        toast.error("You cannot create job opening until associated with a company")
        navigate({ to: "/company" })
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, userType])
}
