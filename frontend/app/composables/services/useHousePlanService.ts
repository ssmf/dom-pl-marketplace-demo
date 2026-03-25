import { useMedusaClient } from '#imports'
import { mapToAppHousePlan } from '~/utils/mappers/housePlanMapper'
import type { AppHousePlan } from '~/types/house-plan'

export interface HousePlanListParams {
  limit?: number
  offset?: number
  minPrice?: number
  maxPrice?: number
  minArea?: number
  maxArea?: number
  rooms?: number
}

export function useHousePlanService() {
  const sdk = useMedusaClient()

  async function listHousePlans(params?: HousePlanListParams): Promise<{ data: AppHousePlan[], count: number, limit: number, offset: number }> {
    try {
      const queryParams = new URLSearchParams()

      if (params) {
        if (params.limit !== undefined) queryParams.append('limit', String(params.limit))
        if (params.offset !== undefined) queryParams.append('offset', String(params.offset))

        if (params.minPrice !== undefined) queryParams.append('price[$gte]', String(params.minPrice))
        if (params.maxPrice !== undefined) queryParams.append('price[$lte]', String(params.maxPrice))

        if (params.minArea !== undefined) queryParams.append('house_area[$gte]', String(params.minArea))
        if (params.maxArea !== undefined) queryParams.append('house_area[$lte]', String(params.maxArea))

        if (params.rooms !== undefined) queryParams.append('rooms', String(params.rooms))
      }

      const queryString = queryParams.toString()
      const url = `/store/house-plans${queryString ? `?${queryString}` : ''}`
      const response = await sdk.client.fetch<{ house_plans: any[], count: number, limit: number, offset: number }>(url)

      return {
        data: (response.house_plans || []).map(mapToAppHousePlan),
        count: response.count || 0,
        limit: response.limit || 0,
        offset: response.offset || 0
      }
    } catch (error) {
      console.error('Failed to list house plans:', error)
      throw error
    }
  }

  async function getHousePlan(id: string): Promise<AppHousePlan> {
    try {
      const response = await sdk.client.fetch<{ house_plan: any }>(`/store/house-plans/${id}`)
      return mapToAppHousePlan(response.house_plan)
    } catch (error) {
      console.error(`Failed to retrieve house plan with ID ${id}:`, error)
      throw error
    }
  }

  return {
    listHousePlans,
    getHousePlan
  }
}
