import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { HousePlanListParams } from '~/composables/services/useHousePlanService'

export function useHousePlanFilters() {
  const route = useRoute()
  const router = useRouter()

  const limit = 12

  const page = computed({
    get: () => Number(route.query.page) || 1,
    set: (val) => {
      const query = { ...route.query }
      if (val > 1) {
        query.page = String(val)
      } else {
        delete query.page
      }
      router.push({ query })
    }
  })

  const offset = computed(() => (page.value - 1) * limit)

  const filters = computed<HousePlanListParams>(() => {
    return {
      minPrice: route.query.minPrice ? Number(route.query.minPrice) : undefined,
      maxPrice: route.query.maxPrice ? Number(route.query.maxPrice) : undefined,
      minArea: route.query.minArea ? Number(route.query.minArea) : undefined,
      maxArea: route.query.maxArea ? Number(route.query.maxArea) : undefined,
      rooms: route.query.rooms ? Number(route.query.rooms) : undefined,
    }
  })

  const applyFilters = (newFilters: HousePlanListParams) => {
    const query: Record<string, any> = { ...route.query, ...newFilters }
    
    // Reset page on filter change
    delete query.page

    // Clean up undefined
    Object.keys(query).forEach((key) => {
      if (query[key] === undefined) {
        delete query[key]
      }
    })

    router.push({ query })
  }

  const clearFilters = () => {
    router.push({ query: {} })
  }

  const serviceParams = computed<HousePlanListParams>(() => ({
    limit,
    offset: offset.value,
    ...filters.value
  }))

  return {
    page,
    limit,
    filters,
    serviceParams,
    applyFilters,
    clearFilters
  }
}
