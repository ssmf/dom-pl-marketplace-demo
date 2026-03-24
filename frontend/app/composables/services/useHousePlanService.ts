import { useMedusaClient } from '#imports'
import { mapToAppHousePlan } from '~/utils/mappers/housePlanMapper'
import type { AppHousePlan } from '~/types/house-plan'

export function useHousePlanService() {
  const sdk = useMedusaClient()

  async function listHousePlans(params?: Record<string, any>): Promise<{ data: AppHousePlan[], count: number, limit: number, offset: number }> {
    try {
      const queryParams = params ? new URLSearchParams(params).toString() : ''
      const url = `/house-plans${queryParams ? `?${queryParams}` : ''}`
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
      const response = await sdk.client.fetch<{ house_plan: any }>(`/house-plans/${id}`)
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
