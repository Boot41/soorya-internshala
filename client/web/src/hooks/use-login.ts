import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginPayload } from "@/schema/auth"

export function useLogin() {
  const form = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  })

  const handleSubmit = form.handleSubmit(async (values: LoginPayload) => {
    await new Promise((r) => setTimeout(r, 3000))
    console.log("login submit:", values)
  })

  const {
    register,
    formState: { errors, isSubmitting },
  } = form

  return { handleSubmit, register, isSubmitting, errors }
}
