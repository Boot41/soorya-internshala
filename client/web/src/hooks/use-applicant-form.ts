import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getApplicantMe, updateApplicantProfile } from '@/api/applicant'
import { getErrorMessage } from '@/utils/error'
import { toast } from 'sonner'
import { uploadProfilePicture, uploadResume as uploadResumeApi } from '@/api/files'

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
}

export type UseApplicantFormOptions = Partial<ApplicantFormState>

export function useApplicantForm(initial?: UseApplicantFormOptions) {
  const queryClient = useQueryClient()

  const [experiences, setExperiences] = useState<ExperienceItem[]>(initial?.experiences ?? [])
  const [educations, setEducations] = useState<EducationItem[]>(initial?.educations ?? [])
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(initial?.avatarUrl)
  const [headline, setHeadline] = useState<string | undefined>(undefined)
  const [bio, setBio] = useState<string | undefined>(undefined)

  const uploadAvatarMutation = useMutation({
    mutationKey: ["applicant", "profile-pic"],
    mutationFn: (file: File) => uploadProfilePicture(file),
    onSuccess: (url: string) => {
      setAvatarUrl(url)
      updateMutation.mutate({ profile_picture_url: url })
    },
    onError: (err) =>
      toast.error(getErrorMessage(err)),
  })

  const uploadResumeMutation = useMutation({
    mutationKey: ["applicant", "resume"],
    mutationFn: (file: File) => uploadResumeApi(file),
    onSuccess: (url: string) => {
      updateMutation.mutate({ resume_url: url })
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const { data: profile, isLoading, isError, refetch } = useQuery({
    queryKey: ['applicant', 'me'],
    queryFn: getApplicantMe,
  })

  useEffect(() => {
    if (!profile) return
    setExperiences((profile.experience ?? []).map((it) => ({
      title: it?.title ?? undefined,
      company: it?.company ?? undefined,
    })))
    setEducations((profile.education ?? []).map((it) => ({
      degree: it?.degree ?? undefined,
      university: it?.university ?? undefined,
    })))
    setAvatarUrl(profile.profile_picture_url ?? undefined)
    setHeadline(profile.headline ?? undefined)
    setBio(profile.bio ?? undefined)
  }, [profile])

  const updateMutation = useMutation({
    mutationFn: updateApplicantProfile,
    onSuccess: (_data, variables) => {
      // Server currently returns a message; we don't rely on the response shape here
      queryClient.invalidateQueries({ queryKey: ['applicant', 'me'] })

      // Optimistically update local editable state from variables if provided
      if (variables?.experience) {
        setExperiences((variables.experience ?? []).map((it) => ({
          title: it?.title ?? undefined,
          company: it?.company ?? undefined,
        })))
      }
      if (variables?.education) {
        setEducations((variables.education ?? []).map((it) => ({
          degree: it?.degree ?? undefined,
          university: it?.university ?? undefined,
        })))
      }
      if (variables?.profile_picture_url !== undefined) {
        setAvatarUrl(variables.profile_picture_url ?? undefined)
      }
      if (variables?.headline !== undefined) {
        setHeadline(variables.headline ?? undefined)
      }
      if (variables?.bio !== undefined) {
        setBio(variables.bio ?? undefined)
      }
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })

  const addExperience = (item: ExperienceItem = { title: '', company: '' }) => {
    setExperiences((prev) => [...prev, item])
  }

  const updateExperience = (index: number, patch: Partial<ExperienceItem>) => {
    setExperiences((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)))
  }

  const removeExperience = (index: number) => {
    setExperiences((prev) => prev.filter((_, i) => i !== index))
  }

  const addEducation = (item: EducationItem = { degree: '', university: '' }) => {
    setEducations((prev) => [...prev, item])
  }

  const updateEducation = (index: number, patch: Partial<EducationItem>) => {
    setEducations((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)))
  }

  const removeEducation = (index: number) => {
    setEducations((prev) => prev.filter((_, i) => i !== index))
  }

  const uploadAvatar = async (file: File): Promise<string> => {
    const url = await uploadAvatarMutation.mutateAsync(file)
    return url
  }

  const uploadResume = async (file: File): Promise<string> => {
    const url = await uploadResumeMutation.mutateAsync(file)
    return url
  }

  return {
    experiences,
    profile,
    educations,
    avatarUrl,
    headline,
    bio,
    isUploadingAvatar: uploadAvatarMutation.isPending,
    isUploadingResume: uploadResumeMutation.isPending,
    isLoadingProfile: isLoading,
    isProfileError: isError,
    refetchProfile: refetch,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    setAvatarUrl,
    setHeadline,
    setBio,
    uploadAvatar,
    uploadResume,
    saveProfile: (payload: Partial<ApplicantFormState> = {}) =>
      updateMutation.mutate({
        experience: payload.experiences ?? experiences,
        education: payload.educations ?? educations,
        profile_picture_url: payload.avatarUrl ?? avatarUrl,
        headline: headline ?? null,
        bio: bio ?? null,
      }),
    isSavingProfile: updateMutation.isPending,
  }
}
