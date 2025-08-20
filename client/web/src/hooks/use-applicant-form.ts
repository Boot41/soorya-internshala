import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getApplicantMe, updateApplicantProfile } from '@/api/applicant'
import api from '@/api/client'
import { getErrorMessage } from '@/utils/error'
import { toast } from 'sonner'

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
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  // Fetch applicant profile
  const { data: profile, isLoading, isError, refetch } = useQuery({
    queryKey: ['applicant', 'me'],
    queryFn: getApplicantMe,
  })

  // Sync local editable state when profile loads/changes
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

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: updateApplicantProfile,
    onSuccess: (data) => {
      // Update cache and local state
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

  // Upload avatar to server and store URL
  const uploadAvatar = async (file: File): Promise<string> => {
    const form = new FormData()
    form.append('file', file)
    setIsUploadingAvatar(true)
    try {
      const res = await api.post<{ url?: string }>('/v1/files/upload/profile', form)
      const url = res.data?.url
      if (!url) throw new Error('No URL returned from server')
      setAvatarUrl(url)
      // Persist to profile
      updateMutation.mutate({ profile_picture_url: url })
      return url
    } catch (err) {
      toast.error(getErrorMessage(err))
      throw err
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  return {
    experiences,
    educations,
    avatarUrl,
    isUploadingAvatar,
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
