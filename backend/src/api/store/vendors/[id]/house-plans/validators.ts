import { z } from "@medusajs/framework/zod"

export const CreateVendorHousePlanSchema = z.object({
  title: z.string().min(1),
  price: z.number().positive(),
  description: z.string().optional(),
  img: z.string().optional(),
  house_area: z.number().positive(),
  boiler_room_area: z.number().positive().optional(),
  rooms: z.number().int().positive(),
  bathrooms_and_wc: z.number().int().positive(),
  plot_dimensions: z.string().min(1),
  min_plot_dimensions_after_adaptation: z.string().optional(),
})

export type CreateVendorHousePlanSchema = z.infer<typeof CreateVendorHousePlanSchema>
