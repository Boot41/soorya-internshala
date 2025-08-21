import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { logout } from "@/api/auth"
import { authStore } from "@/store/auth"
import { userStore } from "@/store/user"
import { toast } from "sonner"

export function useLogout() {
  const navigate = useNavigate()

  const { mutateAsync: doLogout, isPending } = useMutation({
    mutationFn: () => logout(),
    onSuccess: async (data) => {
      // Clear client-side auth and user state
      authStore.clear()
      userStore.clear()
      toast.success(data?.message ?? "Logged out")
      await navigate({ to: "/" })
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "Failed to logout")
    },
  })

  return { logout: doLogout, isLoggingOut: isPending }
}
