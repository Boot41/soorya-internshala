import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginPayload } from "@/schema/auth"
import { useMutation } from "@tanstack/react-query"
import { login } from "@/api/auth"
import { getMe } from "@/api/user"
import { useNavigate } from "@tanstack/react-router"
import { authStore } from "@/store/auth"
import { toast } from "sonner"
import { getErrorMessage } from "@/utils/error"
import { userStore } from "@/store/user"

export function useLogin() {
  const form = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  })
  const navigate = useNavigate()

  const { mutateAsync } = useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: async (data) => {
      if (data?.access_token) authStore.token = data.access_token
      try {
        const me = await getMe()
        // hydrate minimal user state immediately
        userStore.user = {
          userId: me.user_id ?? null,
          fullName: `${me.first_name ?? ''} ${me.last_name ?? ''}`.trim() || null,
          userType: (me as any).user_type ?? null,
        }
        if ((me as any).user_type === "recruiter") {
          await navigate({ to: "/company" })
        } else {
          await navigate({ to: "/" })
        }
      } catch (e) {
        // fallback if /users/me fails
        await navigate({ to: "/" })
      }
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })

  const handleSubmit = form.handleSubmit(async (values: LoginPayload) => {
    await mutateAsync(values)
  })

  const {
    register,
    formState: { errors, isSubmitting },
  } = form

  return { handleSubmit, register, isSubmitting, errors }
}
