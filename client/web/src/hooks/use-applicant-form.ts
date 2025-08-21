import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getApplicantMe, updateApplicantProfile } from '@/api/applicant'
import { getErrorMessage } from '@/utils/error'
import { toast } from 'sonner'
import { uploadProfilePicture, uploadResume as uploadResumeApi } from '@/api/files'
import { useNavigate } from '@tanstack/react-router';
import type { ApplicantFormState, UseApplicantFormOptions } from '@/types/application-form'
import type { EducationItem, ExperienceItem } from '@/types/applicant'


export function useApplicantForm(initial?: UseApplicantFormOptions) {
  const queryClient = useQueryClient()

  const [experiences, setExperiences] = useState<ExperienceItem[]>(initial?.experiences ?? [])
  const [educations, setEducations] = useState<EducationItem[]>(initial?.educations ?? [])
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(initial?.avatarUrl)
  const [headline, setHeadline] = useState<string | undefined>(undefined)
  const [bio, setBio] = useState<string | undefined>(undefined)
  const [skills, setSkills] = useState<string[]>([])

  const navigate = useNavigate()

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
    setSkills((profile as any).skills ?? [])
  }, [profile])

  const updateMutation = useMutation({
    mutationFn: updateApplicantProfile,
    onSuccess: (_data,) => {
      // Server currently returns a message; we don't rely on the response shape here
      queryClient.invalidateQueries({ queryKey: ['applicant', 'me'] })
      toast.success('Profile updated successfully')
      navigate({ to: "/applicant" })
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
    skills,
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
    setSkills,
    uploadAvatar,
    uploadResume,
    saveProfile: (payload: Partial<ApplicantFormState> = {}) =>
      updateMutation.mutate({
        experience: payload.experiences ?? experiences,
        education: payload.educations ?? educations,
        profile_picture_url: payload.avatarUrl ?? avatarUrl,
        headline: headline ?? null,
        bio: bio ?? null,
        skills: payload.skills ?? skills,
      }),
    isSavingProfile: updateMutation.isPending,
  }
}
