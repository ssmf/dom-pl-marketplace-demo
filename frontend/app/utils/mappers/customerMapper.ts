import type { AppCustomer, CustomerApiResponse } from '~/types/customer'

export function mapToAppCustomer(raw: CustomerApiResponse): AppCustomer {
  return {
    id: raw.id || '',
    first_name: raw.first_name || '',
    last_name: raw.last_name || '',
    email: raw.email || '',
    phone: raw.phone ?? null,
    has_account: raw.has_account ?? false,
    created_at: raw.created_at ?? null,
  }
}
