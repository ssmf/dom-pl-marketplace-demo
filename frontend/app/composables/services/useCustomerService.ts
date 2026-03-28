import { useMedusaClient } from '#imports'
import { mapToAppCustomer } from '~/utils/mappers/customerMapper'
import type { AppCustomer, CustomerApiResponse } from '~/types/customer'

export function useCustomerService() {
  const sdk = useMedusaClient()

  async function listCustomers(params?: { limit?: number; offset?: number }): Promise<{ data: AppCustomer[]; count: number }> {
    const queryParams = new URLSearchParams()
    if (params?.limit !== undefined) queryParams.append('limit', String(params.limit))
    if (params?.offset !== undefined) queryParams.append('offset', String(params.offset))

    const queryString = queryParams.toString()
    const url = `/store/customers${queryString ? `?${queryString}` : ''}`
    const response = await sdk.client.fetch<{ customers: CustomerApiResponse[]; count: number }>(url)

    return {
      data: (response.customers || []).map(mapToAppCustomer),
      count: response.count || 0,
    }
  }

  async function getCustomer(id: string): Promise<AppCustomer> {
    const response = await sdk.client.fetch<{ customer: CustomerApiResponse }>(`/store/customers/${id}`)
    return mapToAppCustomer(response.customer)
  }

  async function getCustomerOrders(customerId: string) {
    const response = await sdk.client.fetch<{ orders: import('~/types/order').AppOrder[] }>(`/store/customers/${customerId}/orders`)
    return response.orders || []
  }

  return { listCustomers, getCustomer, getCustomerOrders }
}
