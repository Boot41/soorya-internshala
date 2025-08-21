export type ExperienceItem = {
    title?: string
    company?: string
  }
  
  export type EducationItem = {
    degree?: string
    university?: string
  }
  
  export type ApplicantFormState = {
    experiences: ExperienceItem[]
    educations: EducationItem[]
    avatarUrl?: string
    skills?: string[]
  }
  
  export type UseApplicantFormOptions = Partial<ApplicantFormState>