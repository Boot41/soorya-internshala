import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { logout } from "@/api/auth"
import { authStore } from "@/store/auth"
import { userStore } from "@/store/user"
import { toast } from "sonner"
import { getErrorMessage } from "@/utils/error"

export function useLogout() {
  const navigate = useNavigate()

  const { mutateAsync: doLogout, isPending } = useMutation({
    mutationFn: () => logout(),
    onSuccess: async (data) => {
      await navigate({ to: "/" })
      authStore.clear()
      userStore.clear()
      toast.success(data?.message ?? "Logged out")
    },
    onError: (err: any) => {
      toast.error(getErrorMessage(err))
    },
  })

  return { logout: doLogout, isLoggingOut: isPending }
}
