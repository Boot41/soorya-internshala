import { z } from "zod"

export const UserTypeEnum = z.enum(["applicant", "recruiter"]) // server value strings

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Password is required"),
})

export type LoginPayload = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.email(),
  password: z.string().min(1, "Password is required"),
  user_type: UserTypeEnum,
})

export type RegisterPayload = z.infer<typeof registerSchema>
