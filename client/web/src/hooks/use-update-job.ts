import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getJobListing, updateJobListing } from "@/api/job-listing"
import type { JobListingUpdatePayload } from "@/types/job-listing"
import { toast } from "sonner"

const updateSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  requirements: z.string().min(5).optional(),
  skills_required: z.array(z.string().trim().min(1)).optional(),
  location: z.string().min(2).optional(),
  experience_level: z.string().min(2).optional(),
  job_type: z.enum(["full-time", "part-time", "internship", "contract"]).optional(),
  salary_range: z.string().optional(),
  expires_at: z.date().optional(),
  status: z.enum(["open", "closed", "draft"]).optional(),
})

export type UpdateJobPayload = z.infer<typeof updateSchema>

export function useUpdateJob(jobId: string) {
  const qc = useQueryClient()

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
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "Failed to update job")
    },
  })

  // Raw input for skills
  const [skillsInput, setSkillsInput] = useState<string>("")

  useEffect(() => {
    if (!data) return
    // Hydrate form with existing values
    form.reset({
      title: data.title,
      description: data.description,
      requirements: data.requirements,
      skills_required: (data.skills_required ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      location: data.location,
      experience_level: data.experience_level ?? undefined,
      job_type: data.job_type,
      salary_range: data.salary_range ?? undefined,
      expires_at: data.expires_at ? new Date(data.expires_at) : undefined,
      status: data.status,
    })
    setSkillsInput(
      (data.skills_required ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .join(", ")
    )
  }, [data])

  const setSkills = (raw: string) => {
    setSkillsInput(raw)
    const skills = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
    form.setValue("skills_required", skills, { shouldDirty: true, shouldValidate: true })
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

  const expiresAt = form.watch("expires_at")
  const jobType = form.watch("job_type")
  const status = form.watch("status")

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
    setSkills,
    skillsInput,
    expiresAt,
    jobType,
    status,
  }
}
