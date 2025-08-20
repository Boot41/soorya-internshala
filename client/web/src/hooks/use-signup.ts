import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, type RegisterPayload } from "@/schema/auth"

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

  const handleSubmit = form.handleSubmit((values: RegisterPayload) => {
    console.log("sign-up submit:", values)
  })

  const setUserType = (type: "applicant" | "recruiter") => form.setValue("user_type", type)

  const {
    register,
    formState: { errors, isSubmitting },
  } = form

  return { handleSubmit, register, isSubmitting, errors, setUserType }
}
