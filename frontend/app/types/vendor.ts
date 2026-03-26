export interface AppVendor {
  id: string
  company_name: string
  first_name: string
  last_name: string
  email: string
  published_plans_count: number
  house_plans_count: number
  revenue: number
  average_rating: number | null
  created_at: string | null
}

export type VendorApiResponse = {
  id: string
  company_name: string
  first_name: string
  last_name: string
  email: string
  published_plans_count: number
  house_plans_count: number
  revenue: number
  average_rating: number | null
  created_at: string | null
}
