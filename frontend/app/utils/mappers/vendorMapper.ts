import type { AppVendor } from '~/types/vendor'

export function mapToAppVendor(raw: any): AppVendor {
  return {
    id: raw.id,
    company_name: raw.company_name,
    first_name: raw.first_name,
    last_name: raw.last_name,
    email: raw.email,
    published_plans_count: raw.published_plans_count ?? 0,
    revenue: raw.revenue ?? 0,
    orders_count: raw.orders_count ?? 0,
    average_rating: raw.average_rating ?? null,
  }
}
