import { useMedusaClient } from '#imports'
import { mapToAppVendor } from '~/utils/mappers/vendorMapper'
import { mapToAppHousePlan } from '~/utils/mappers/housePlanMapper'
import type { AppVendor, VendorApiResponse } from '~/types/vendor'
import type { AppHousePlan, HousePlanApiResponse } from '~/types/house-plan'

export function useVendorService() {
  const sdk = useMedusaClient()

  async function listVendors(params?: { limit?: number; offset?: number }): Promise<{ data: AppVendor[]; count: number }> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.limit !== undefined) queryParams.append('limit', String(params.limit))
      if (params?.offset !== undefined) queryParams.append('offset', String(params.offset))

      const queryString = queryParams.toString()
      const url = `/store/vendors${queryString ? `?${queryString}` : ''}`
      const response = await sdk.client.fetch<{ vendors: VendorApiResponse[]; count: number }>(url)

      return {
        data: (response.vendors || []).map(mapToAppVendor),
        count: response.count || 0
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

  async function getVendorHousePlans(vendorId: string): Promise<AppHousePlan[]> {
    try {
      const response = await sdk.client.fetch<{ house_plans: HousePlanApiResponse[] }>(`/store/vendors/${vendorId}/house-plans`)
      return (response.house_plans || []).map(mapToAppHousePlan)
    } catch (error) {
      console.error(`Failed to retrieve house plans for vendor ${vendorId}:`, error)
      throw error
    }
  }

  return { listVendors, getVendor, getVendorHousePlans }
}
