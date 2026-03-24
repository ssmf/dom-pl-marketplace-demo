<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHousePlanService } from '~/composables/services/useHousePlanService'
import HousePlanCard from '~/components/HousePlanCard.vue'
import HousePlanFilters from '~/components/HousePlanFilters.vue'
import type { FilterState } from '~/components/HousePlanFilters.vue'

const route = useRoute()
const router = useRouter()
const housePlanService = useHousePlanService()

// Pagination state
const page = ref(Number(route.query.page) || 1)
const limit = 12

// Filters state
const filters = ref<FilterState>({
  minPrice: route.query.minPrice ? Number(route.query.minPrice) : undefined,
  maxPrice: route.query.maxPrice ? Number(route.query.maxPrice) : undefined,
  minArea: route.query.minArea ? Number(route.query.minArea) : undefined,
  maxArea: route.query.maxArea ? Number(route.query.maxArea) : undefined,
  rooms: route.query.rooms ? Number(route.query.rooms) : undefined,
})

const offset = computed(() => (page.value - 1) * limit)

// Fetch data
const { data, status, refresh } = await useAsyncData(
  'house-plans',
  () => {
    const params: Record<string, any> = {
      limit,
      offset: offset.value,
      ...filters.value
    }
    
    // Clean up undefined values
    Object.keys(params).forEach(key => {
      if (params[key] === undefined) {
        delete params[key]
      }
    })

    return housePlanService.listHousePlans(params)
  },
  { watch: [page] }
)

const applyFilters = () => {
  page.value = 1 // Reset to first page on filter change
  updateUrl()
  refresh()
}

const updateUrl = () => {
  const query: Record<string, any> = { ...filters.value }
  if (page.value > 1) {
    query.page = page.value
  }
  
  // Clean up undefined
  Object.keys(query).forEach(key => {
    if (query[key] === undefined) {
      delete query[key]
    }
  })

  router.push({ query })
}

// Watch URL changes to update state if needed (e.g. browser back button)
watch(() => route.query, (newQuery) => {
  const newPage = Number(newQuery.page) || 1
  if (page.value !== newPage) {
    page.value = newPage
  }
}, { deep: true })
</script>

<template>
  <div class="flex flex-col lg:flex-row flex-1">
    <!-- Sidebar Filters -->
    <aside class="w-full lg:w-72 shrink-0 border-r border-[var(--ui-border)] bg-[var(--ui-bg)] p-6">
      <div class="sticky top-6">
        <h2 class="text-xl font-bold mb-6 text-default">Filtry</h2>
        <HousePlanFilters v-model="filters" @apply="applyFilters" />
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6 lg:p-8 bg-[var(--ui-bg-elevated)]">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-default">Projekty domów</h1>
        <p class="text-muted mt-2">Znajdź swój wymarzony projekt domu</p>
      </div>

      <div v-if="status === 'pending'" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <USkeleton v-for="i in 6" :key="i" class="h-80 w-full rounded-xl" />
      </div>

      <div v-else-if="data?.data?.length" class="space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <HousePlanCard
            v-for="plan in data.data"
            :key="plan.id"
            :plan="plan"
          />
        </div>

        <!-- Pagination -->
        <div class="flex justify-center" v-if="data.count > limit">
          <UPagination
            v-model:page="page"
            :total="data.count"
            :items-per-page="limit"
            @update:page="updateUrl"
          />
        </div>
      </div>

      <div v-else class="text-center py-16 bg-[var(--ui-bg)] border border-[var(--ui-border)] rounded-xl">
        <UIcon name="i-lucide-search-x" class="size-12 text-muted-foreground mx-auto mb-4" />
        <h3 class="text-lg font-medium">Brak wyników</h3>
        <p class="text-muted mt-1">Nie znaleziono projektów spełniających podane kryteria.</p>
        <UButton class="mt-4" variant="outline" @click="() => { filters = {}; applyFilters() }">
          Wyczyść filtry
        </UButton>
      </div>
    </main>
  </div>
</template>
