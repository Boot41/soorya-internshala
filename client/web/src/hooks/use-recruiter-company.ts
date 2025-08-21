import React from "react"
import { useNavigate } from "@tanstack/react-router"
import { useMe } from "@/hooks/use-me"
import { useCompany } from "@/hooks/use-company"
import { useCompanies } from "@/hooks/use-companies"
import { useUpdateMe } from "@/hooks/use-update-me"

export function useRecruiterCompany() {
  const navigate = useNavigate()

  const { data: me, isLoading: meLoading, isError: meIsError, error: meError } = useMe()
  const recruiterCompanyId = me && "company_id" in me ? (me as any).company_id as string | null : null

  const {
    data: company,
    isLoading: companyLoading,
    isError: companyIsError,
    error: companyError,
  } = useCompany(recruiterCompanyId ?? "")

  const {
    data: companies,
    isLoading: companiesLoading,
    isError: companiesIsError,
    error: companiesError,
  } = useCompanies()

  const { update, isUpdating } = useUpdateMe()

  const [selectedCompanyId, setSelectedCompanyId] = React.useState<string | undefined>(undefined)

  const handleSetCompany = async () => {
    if (!selectedCompanyId) return
    await update({ company_id: selectedCompanyId })
    navigate({ to: "/company/$companyId", params: { companyId: selectedCompanyId } })
  }

  const goCreateCompany = () => navigate({ to: "/company/create" })

  return {
    // profile state
    me,
    meLoading,
    meIsError,
    meError,
    recruiterCompanyId,

    // current company state
    company,
    companyLoading,
    companyIsError,
    companyError,

    // companies list
    companies,
    companiesLoading,
    companiesIsError,
    companiesError,

    // selection actions
    selectedCompanyId,
    setSelectedCompanyId,
    handleSetCompany,
    goCreateCompany,
    isUpdating,
  }
}
