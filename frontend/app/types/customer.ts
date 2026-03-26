export type CustomerApiResponse = {
  id: string
  first_name: string | null
  last_name: string | null
  email: string
  phone: string | null
  has_account: boolean
  created_at: string | null
}

export interface AppCustomer {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  has_account: boolean
  created_at: string | null
}
