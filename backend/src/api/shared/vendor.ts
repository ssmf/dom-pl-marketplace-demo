import { InferTypeOf } from "@medusajs/framework/utils"
import VendorModel from "../../modules/vendor/models/vendor"

export type VendorDTO = InferTypeOf<typeof VendorModel>

export type VendorWithCount = Omit<VendorDTO, "house_plans"> & {
  house_plans_count: number
}

export const VENDOR_GRAPH_FIELDS = [
  "id", "company_name", "first_name", "last_name", "email",
  "published_plans_count", "revenue", "average_rating", "created_at",
  "house_plans.id",
] as const

export function toVendorWithCount(raw: VendorDTO & { house_plans?: { id: string }[] }): VendorWithCount {
  const { house_plans, ...rest } = raw as any
  return { ...rest, house_plans_count: house_plans?.length ?? 0 }
}
