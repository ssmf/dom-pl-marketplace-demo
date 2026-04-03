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
      floors: route.query.floors ? Number(route.query.floors) : undefined,
      garage: route.query.garage ? String(route.query.garage) : undefined,
      basement: route.query.basement ? String(route.query.basement) : undefined,
      houseType: route.query.houseType ? String(route.query.houseType) : undefined,
      architecturalStyle: route.query.architecturalStyle ? String(route.query.architecturalStyle) : undefined,
      energyStandard: route.query.energyStandard ? String(route.query.energyStandard) : undefined,
    }
  })

  const categoryLabel = computed<string | null>(() => {
    const q = route.query
    const labels: string[] = []

    if (q.floors === '1') labels.push('parterowe')
    else if (q.floors === '2') labels.push('piętrowe')
    else if (q.floors) labels.push(`${q.floors}-kondygnacyjne`)

    if (q.maxArea && !q.minArea) labels.push(`do ${q.maxArea} m²`)
    else if (q.minArea && !q.maxArea) labels.push(`powyżej ${q.minArea} m²`)
    else if (q.minArea && q.maxArea) labels.push(`${q.minArea}–${q.maxArea} m²`)

    if (q.rooms) labels.push(`${q.rooms} ${Number(q.rooms) === 1 ? 'pokój' : Number(q.rooms) < 5 ? 'pokoje' : 'pokoi'}`)

    if (q.architecturalStyle) labels.push(String(q.architecturalStyle))
    if (q.houseType) labels.push(String(q.houseType))
    if (q.energyStandard) labels.push(String(q.energyStandard))
    if (q.garage && q.garage !== 'brak') labels.push('z garażem')

    if (q.minPrice && !q.maxPrice) labels.push(`od ${Number(q.minPrice).toLocaleString('pl-PL')} PLN`)
    else if (q.maxPrice && !q.minPrice) labels.push(`do ${Number(q.maxPrice).toLocaleString('pl-PL')} PLN`)
    else if (q.minPrice && q.maxPrice) labels.push(`${Number(q.minPrice).toLocaleString('pl-PL')}–${Number(q.maxPrice).toLocaleString('pl-PL')} PLN`)

    if (labels.length === 0) return null
    return 'Projekty domów ' + labels.join(', ')
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
    categoryLabel,
    serviceParams,
    applyFilters,
    clearFilters
  }
}
