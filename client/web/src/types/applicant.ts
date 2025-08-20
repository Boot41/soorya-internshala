export type ExperienceItem = {
  title?: string | null
  company?: string | null
}

export type EducationItem = {
  degree?: string | null
  university?: string | null
}

export type UserProfileApplicantResponse = {
  user_id: string
  email: string
  user_type: string
  first_name: string
  last_name: string
  headline?: string | null
  bio?: string | null
  resume_url?: string | null
  experience: ExperienceItem[]
  education: EducationItem[]
  profile_picture_url?: string | null
}

export type UpdateUserProfile = {
  headline?: string | null
  bio?: string | null
  resume_url?: string | null
  experience?: ExperienceItem[] | null
  education?: EducationItem[] | null
  profile_picture_url?: string | null
  company_id?: string | null
}

export type ApplicantBasicsPayload = {
  headline?: string | null
  bio?: string | null
  experience?: ExperienceItem[] | null
  education?: EducationItem[] | null
}