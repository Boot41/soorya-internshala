import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { jobListingSchema, type JobListingPayload } from "@/schema/job-listing"
import { useMutation } from "@tanstack/react-query"
import { createJobListing } from "@/api/job-listing"
import { getErrorMessage } from "@/utils/error"
import { toast } from "sonner"
import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import type { JobListingRequestPayload } from "@/types/job-listing"

export function useCreateJob() {
  const navigate = useNavigate()
  const form = useForm<JobListingPayload>({
    resolver: zodResolver(jobListingSchema),
    defaultValues: {
      title: "",
      description: "",
      requirements: "",
      skills_required: [],
      location: "",
      experience_level: "",
      job_type: "full-time",
      salary_range: "",
      expires_at: undefined,
      status: "open",
    },
    mode: "onSubmit",
  })

  const { mutateAsync } = useMutation({
    mutationFn: (payload: JobListingRequestPayload) => createJobListing(payload),
    onSuccess: (data) => {
      toast.success(data?.message ?? "Job listing created")
      if (data?.job_id) 
        navigate({ to: "/job-listing/$jobId", params: {jobId: data.job_id} })
      
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })

  const handleSubmit = form.handleSubmit(async (values: JobListingPayload) => {
    const payload = {
      ...values,
      skills_required: values.skills_required?.join(", ") ?? undefined,
    }
    await mutateAsync(payload)
  })

  const {
    register,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = form

  // Skills helpers (badge-style)
  const [skillDraft, setSkillDraft] = useState<string>("")
  const skills = watch("skills_required") ?? []
  const addSkill = (s: string) => {
    const v = s.trim()
    if (!v) return
    if (skills.includes(v)) return
    setValue("skills_required", [...skills, v], { shouldDirty: true, shouldValidate: true })
    setSkillDraft("")
  }
  const removeSkill = (s: string) => {
    setValue(
      "skills_required",
      skills.filter((it) => it !== s),
      { shouldDirty: true, shouldValidate: true }
    )
  }


  const setExpiresAt = (date: JobListingPayload["expires_at"]) => {
    setValue("expires_at", date, { shouldDirty: true, shouldValidate: true })
  }

  const setStatus = (status: JobListingPayload["status"]) => {
    setValue("status", status, { shouldDirty: true, shouldValidate: true })
  }

  const setJobType = (jobType: JobListingPayload["job_type"]) => {
    setValue("job_type", jobType, { shouldDirty: true, shouldValidate: true })
  }

  const setExperienceLevel = (exp: JobListingPayload["experience_level"]) => {
    setValue("experience_level", exp, { shouldDirty: true, shouldValidate: true })
  }

  const expiresAt = watch("expires_at")
  const experienceLevel = watch("experience_level")

  return {
    handleSubmit,
    register,
    isSubmitting,
    errors,
    setExpiresAt,
    setStatus,
    setJobType,
    setExperienceLevel,
    // skills controls
    skills,
    addSkill,
    removeSkill,
    skillDraft,
    setSkillDraft,
    expiresAt,
    experienceLevel,
  }
}

