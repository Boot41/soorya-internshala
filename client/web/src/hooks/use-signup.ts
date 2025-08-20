import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, type RegisterPayload } from "@/schema/auth"
import { useMutation } from "@tanstack/react-query"
import { register as registerApi } from "@/api/auth"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { getErrorMessage } from "@/utils/error"

export function useSignUp() {
  const form = useForm<RegisterPayload>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      user_type: "applicant",
    },
    mode: "onSubmit",
  })
  const navigate = useNavigate()

  const { mutateAsync } = useMutation({
    mutationFn: (payload: RegisterPayload) => registerApi(payload),
    onSuccess: async () => {
      await navigate({ to: "/auth/login" })
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })

  const handleSubmit = form.handleSubmit(async (values: RegisterPayload) => {
    await mutateAsync(values)
  })

  const setUserType = (type: "applicant" | "recruiter") => form.setValue("user_type", type)

  const {
    register,
    formState: { errors, isSubmitting },
  } = form

  return { handleSubmit, register, isSubmitting, errors, setUserType }
}
