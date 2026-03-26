import { z } from "zod"

export const CreateVendorSchema = z.object({
  company_name: z.string().min(1),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
})

export type CreateVendorSchema = z.infer<typeof CreateVendorSchema>

export const UpdateVendorSchema = CreateVendorSchema.partial()

export type UpdateVendorSchema = z.infer<typeof UpdateVendorSchema>
