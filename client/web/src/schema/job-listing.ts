import { z } from "zod"

export const jobListingSchema = z.object({
  title: z.string().min(2, "Title is too short"),
  description: z.string().min(10, "Please provide a longer description"),
  requirements: z.string().min(5, "Please add some requirements"),
  skills_required: z
    .array(z.string().trim().min(1, "Skill cannot be empty"))
    .optional(),
  location: z.string().min(2, "Please specify a location"),
  experience_level: z.string().min(2, "Please specify experience level"),
  job_type: z.enum(["full-time", "part-time", "internship", "contract"], {
    message: "Please select a job type",
  }),
  salary_range: z.string().optional(),
  // Calendar returns a Date. Keep optional if UI doesn't force pick before submit.
  expires_at: z.date().optional(),
  status: z.enum(["open", "closed", "draft"], {
    message: "Please select a status",
  }),
})

export type JobListingPayload = z.infer<typeof jobListingSchema>

export const updateSchema = z.object({
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