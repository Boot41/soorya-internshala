import { z } from "zod"

const urlSchema = z
  .url({ message: "Must be a valid URL" })
  .optional()
  .or(z.literal("").transform(() => undefined))

export const companySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Company name is required" })
    .max(200, { message: "Company name is too long" }),
  description: z
    .string()
    .trim()
    .max(5000, { message: "Description is too long" })
    .optional()
    .or(z.literal("").transform(() => undefined)),
  website_url: urlSchema, // optional
  logo_url: urlSchema, // optional manual URL (not the uploaded file)
  industry: z
    .string()
    .trim()
    .max(200, { message: "Industry is too long" })
    .optional()
    .or(z.literal("").transform(() => undefined)),
  headquarters: z
    .string()
    .trim()
    .max(200, { message: "Headquarters is too long" })
    .optional()
    .or(z.literal("").transform(() => undefined)),
})

export type CompanyPayload = z.infer<typeof companySchema>
