import type { AppVendor } from '~/types/vendor'

export function mapToAppVendor(raw: any): AppVendor {
  return {
    id: raw.id,
    company_name: raw.company_name,
    first_name: raw.first_name,
    last_name: raw.last_name,
    email: raw.email,
    published_plans_count: raw.published_plans_count ?? 0,
    house_plans_count: raw.house_plans_count ?? 0,
    revenue: raw.revenue ?? 0,
    average_rating: raw.average_rating ?? null,
    created_at: raw.created_at ?? null
  }
}
