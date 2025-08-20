import { z } from "zod"

export const UserTypeEnum = z.enum(["applicant", "recruiter"]) // server value strings

// Reusable schemas
export const emailSchema = z.email({ message: "Invalid Email" })
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(35, "Password must be at most 35 characters")
  .regex(/[a-z]/, "Must include at least one lowercase letter")
  .regex(/[A-Z]/, "Must include at least one uppercase letter")
  .regex(/\d/, "Must include at least one number")
  .regex(/[^A-Za-z0-9]/, "Must include at least one special character")

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export type LoginPayload = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: emailSchema,
  password: passwordSchema,
  user_type: UserTypeEnum,
})

export type RegisterPayload = z.infer<typeof registerSchema>
