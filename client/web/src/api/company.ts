// client/web/src/api/company.ts
import api from "@/api/client"
import { getErrorMessage } from "@/utils/error"
import type { CompanyPayload } from "@/schema/company"

export interface CreateCompanyResponse {
  message: string
  company_id: string
}

export async function createCompany(payload: CompanyPayload): Promise<CreateCompanyResponse> {
  try {
    const { data } = await api.post<CreateCompanyResponse>("/companies/", payload)
    return data
  } catch (err) {
    console.error("[createCompany]", err)
    throw new Error(getErrorMessage(err))
  }
}

// Generic company type for fetch/update flows
export type Company = CompanyPayload & {
  id: string
}

export async function getCompany(companyId: string): Promise<Company> {
  try {
    const { data } = await api.get<Company>(`/companies/${companyId}/`)
    return data
  } catch (err) {
    console.error("[getCompany]", err)
    throw new Error(getErrorMessage(err))
  }
}

export async function updateCompany(companyId: string, payload: CompanyPayload): Promise<{ message: string }> {
  try {
    const { data } = await api.put<{ message: string }>(`/companies/${companyId}`, payload)
    return data
  } catch (err) {
    console.error("[updateCompany]", err)
    throw new Error(getErrorMessage(err))
  }
}
