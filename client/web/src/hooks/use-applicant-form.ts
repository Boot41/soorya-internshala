import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getApplicantMe, updateApplicantProfile } from '@/api/applicant'
import { getErrorMessage } from '@/utils/error'
import { toast } from 'sonner'
import { uploadProfilePicture } from '@/api/files'

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
  }, [profile])

  const updateMutation = useMutation({
    mutationFn: updateApplicantProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['applicant', 'me'], data)
      setExperiences((data.experience ?? []).map((it) => ({
        title: it?.title ?? undefined,
        company: it?.company ?? undefined,
      })))
      setEducations((data.education ?? []).map((it) => ({
        degree: it?.degree ?? undefined,
        university: it?.university ?? undefined,
      })))
      setAvatarUrl(data.profile_picture_url ?? undefined)
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

  return {
    experiences,
    profile,
    educations,
    avatarUrl,
    isUploadingAvatar: uploadAvatarMutation.isPending,
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
    uploadAvatar,
    saveProfile: (payload: Partial<ApplicantFormState> = {}) =>
      updateMutation.mutate({
        experience: payload.experiences ?? experiences,
        education: payload.educations ?? educations,
        profile_picture_url: payload.avatarUrl ?? avatarUrl,
      }),
    isSavingProfile: updateMutation.isPending,
  }
}
