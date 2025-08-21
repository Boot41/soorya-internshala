export type UserType = "applicant" | "recruiter"

export interface UserProfileBase {
  user_id: string
  email: string
  user_type: UserType
  first_name: string
  last_name: string
}

export interface UserProfileRecruiterResponse extends UserProfileBase {
  company_id: string | null
}

export type UserMeResponse = UserProfileRecruiterResponse | UserProfileBase

export interface UpdateUserProfilePayload {
  company_id?: string | null
}