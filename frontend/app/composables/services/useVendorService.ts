import { useMedusaClient } from '#imports'
import { mapToAppVendor } from '~/utils/mappers/vendorMapper'
import type { AppVendor } from '~/types/vendor'

export function useVendorService() {
  const sdk = useMedusaClient()

  async function listVendors(params?: { limit?: number; offset?: number }): Promise<{ data: AppVendor[]; count: number }> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.limit !== undefined) queryParams.append('limit', String(params.limit))
      if (params?.offset !== undefined) queryParams.append('offset', String(params.offset))

      const queryString = queryParams.toString()
      const url = `/store/vendors${queryString ? `?${queryString}` : ''}`
      const response = await sdk.client.fetch<{ vendors: any[]; count: number }>(url)

      return {
        data: (response.vendors || []).map(mapToAppVendor),
        count: response.count || 0,
      }
    } catch (error) {
      console.error('Failed to list vendors:', error)
      throw error
    }
  }

  async function getVendor(id: string): Promise<AppVendor> {
    try {
      const response = await sdk.client.fetch<{ vendor: any }>(`/store/vendors/${id}`)
      return mapToAppVendor(response.vendor)
    } catch (error) {
      console.error(`Failed to retrieve vendor with ID ${id}:`, error)
      throw error
    }
  }

  return { listVendors, getVendor }
}
