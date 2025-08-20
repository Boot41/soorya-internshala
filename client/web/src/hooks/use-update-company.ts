import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { companySchema, type CompanyPayload } from "@/schema/company"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getCompany, updateCompany } from "@/api/company"
import { getErrorMessage } from "@/utils/error"
import { toast } from "sonner"

export function useUpdateCompany(companyId: string) {
  const queryClient = useQueryClient()
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

  const { data, isLoading: isFetching } = useQuery({
    queryKey: ["company", companyId],
    queryFn: () => getCompany(companyId),
    enabled: !!companyId,
  })

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name ?? "",
        description: data.description ?? "",
        website_url: data.website_url ?? "",
        logo_url: data.logo_url ?? "",
        industry: data.industry ?? "",
        headquarters: data.headquarters ?? "",
      })
    }
  }, [data, form])

  const { mutateAsync } = useMutation({
    mutationKey: ['company','update'],
    mutationFn: (payload: CompanyPayload) => updateCompany(companyId, payload),
    onSuccess: async (res, variables) => {
      toast.success(res?.message ?? "Company updated")
      // Refresh cached company data
      await queryClient.invalidateQueries({ queryKey: ["company", companyId] })
      // Reset form with latest submitted values to reflect UI immediately
      form.reset(variables)
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

  const logoUrl = data?.logo_url
  const companyInitial = (data?.name?.[0] || "C").toUpperCase()

  return { handleSubmit, register, errors, isSubmitting, isFetching, logoUrl, companyInitial }
}
