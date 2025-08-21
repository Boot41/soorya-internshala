import { useEffect, useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getJobListing, updateJobListing } from "@/api/job-listing"
import type { JobListingUpdatePayload } from "@/types/job-listing"
import { toast } from "sonner"
import { updateSchema } from "@/schema/job-listing"



export type UpdateJobPayload = z.infer<typeof updateSchema>

export function useUpdateJob(jobId: string) {
  const qc = useQueryClient()
  const navigate = useNavigate()

  const form = useForm<UpdateJobPayload>({
    resolver: zodResolver(updateSchema),
    defaultValues: {},
  })

  const { data, isLoading: isFetching } = useQuery({
    queryKey: ["job-listing", jobId],
    queryFn: () => getJobListing(jobId),
    enabled: !!jobId,
  })

  const { mutateAsync, isPending: isSubmitting } = useMutation({
    mutationFn: (payload: JobListingUpdatePayload) => updateJobListing(jobId, payload),
    onSuccess: async (res) => {
      toast.success(res?.message ?? "Job updated")
      await qc.invalidateQueries({ queryKey: ["job-listing", jobId] })
      navigate({ to: "/job-listing/$jobId", params: {jobId: jobId} })
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "Failed to update job")
    },
  })

  // Skills controls (badge-style)
  const [skillDraft, setSkillDraft] = useState<string>("")

  useEffect(() => {
    if (!data) return
    // Hydrate form with existing values
    form.reset({
      title: data.title,
      description: data.description,
      requirements: data.requirements,
      skills_required: (data.skills_required ?? "").split(",").map((s) => s.trim()).filter(Boolean),
      location: data.location,
      experience_level: data.experience_level ?? undefined,
      job_type: data.job_type,
      salary_range: data.salary_range ?? undefined,
      expires_at: data.expires_at ? new Date(data.expires_at) : undefined,
      status: data.status,
    })
    setSkillDraft("")
  }, [data])

  const skills = form.watch("skills_required") ?? []
  const addSkill = (s: string) => {
    const v = s.trim()
    if (!v) return
    if (skills.includes(v)) return
    form.setValue("skills_required", [...skills, v], { shouldDirty: true, shouldValidate: true })
    setSkillDraft("")
  }
  const removeSkill = (s: string) => {
    form.setValue(
      "skills_required",
      skills.filter((it: string) => it !== s),
      { shouldDirty: true, shouldValidate: true }
    )
  }

  const setExpiresAt = (date?: Date) => {
    form.setValue("expires_at", date, { shouldDirty: true, shouldValidate: true })
  }

  const setStatus = (status: UpdateJobPayload["status"]) => {
    form.setValue("status", status, { shouldDirty: true, shouldValidate: true })
  }

  const setJobType = (jobType: NonNullable<UpdateJobPayload["job_type"]>) => {
    form.setValue("job_type", jobType, { shouldDirty: true, shouldValidate: true })
  }

  const setExperienceLevel = (exp: string) => {
    form.setValue("experience_level", exp, { shouldDirty: true, shouldValidate: true })
  }

  const expiresAt = form.watch("expires_at")
  const jobType = form.watch("job_type")
  const status = form.watch("status")
  const experienceLevel = form.watch("experience_level")

  const handleSubmit = form.handleSubmit(async (values) => {
    const payload: JobListingUpdatePayload = {
      ...values,
      skills_required: values.skills_required?.join(", ") ?? undefined,
    }
    await mutateAsync(payload)
  })

  return {
    register: form.register,
    handleSubmit,
    errors: form.formState.errors,
    isSubmitting,
    isFetching,
    setJobType,
    setStatus,
    setExpiresAt,
    setExperienceLevel,
    addSkill,
    removeSkill,
    skills,
    skillDraft,
    setSkillDraft,
    expiresAt,
    jobType,
    status,
    experienceLevel,
  }
}
