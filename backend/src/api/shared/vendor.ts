export const VENDOR_GRAPH_FIELDS = [
  "id", "company_name", "first_name", "last_name", "email",
  "revenue", "average_rating", "created_at",
  "house_plans.id",
] as const

export function toVendorWithCount(raw: any): any {
  const { house_plans, ...rest } = raw
  return { ...rest, house_plans_count: house_plans?.length ?? 0 }
}
