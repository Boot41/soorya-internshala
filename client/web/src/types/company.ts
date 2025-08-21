import type { CompanyPayload } from "@/schema/company"

export interface CreateCompanyResponse {
  message: string
  company_id: string
}

// Generic company type for fetch/update flows
export type Company = CompanyPayload & {
  id: string
}
