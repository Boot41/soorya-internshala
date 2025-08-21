import { useMutation } from "@tanstack/react-query"
import { updateMe } from "@/api/user"
import { getErrorMessage } from "@/utils/error"
import type { UpdateUserProfilePayload } from "@/types/user"
import { toast } from "sonner"

export function useUpdateMe() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: UpdateUserProfilePayload) => updateMe(payload),
    onSuccess: (data) => {
      toast.success(data?.message ?? "Profile updated")
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })

  return {
    update: mutateAsync,
    isUpdating: isPending,
  }
}
