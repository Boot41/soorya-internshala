import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { companySchema, type CompanyPayload } from "@/schema/company"
import { useMutation } from "@tanstack/react-query"
import { createCompany } from "@/api/company"
import { getErrorMessage } from "@/utils/error"
import { toast } from "sonner"

export function useCreateCompany() {
  const form = useForm<CompanyPayload>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      description: "",
      website_url: "",
      logo_url: "",
      industry: "",
      headquarters: "",
    },
    mode: "onSubmit",
  })

  const { mutateAsync } = useMutation({
    mutationFn: (payload: CompanyPayload) => createCompany(payload),
    onSuccess: (data) => {
      toast.success(data?.message ?? "Company created")
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })

  const handleSubmit = form.handleSubmit(async (values: CompanyPayload) => {
    await mutateAsync(values)
  })

  const {
    register,
    formState: { errors, isSubmitting },
  } = form

  return { handleSubmit, register, isSubmitting, errors }
}
