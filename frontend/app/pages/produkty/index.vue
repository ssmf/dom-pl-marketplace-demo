<script setup lang="ts">
import { useHousePlanService } from "~/composables/services/useHousePlanService";
import { useHousePlanFilters } from "~/composables/useHousePlanFilters";
import HousePlanCard from "~/components/HousePlanCard.vue";
import HousePlanFilters from "~/components/HousePlanFilters.vue";

const housePlanService = useHousePlanService();
const { page, limit, filters, serviceParams, applyFilters, clearFilters } =
  useHousePlanFilters();

const handleApplyFilters = (newFilters: any) => {
  console.log("handleApplyFilters triggered!", newFilters);
  applyFilters(newFilters);
};

const handleClearFilters = () => {
  console.log("handleClearFilters triggered!");
  clearFilters();
};

// Fetch data
const { data, status } = await useAsyncData(
  "house-plans",
  () => housePlanService.listHousePlans(serviceParams.value),
  { watch: [serviceParams] },
);
</script>

<template>
  <div class="flex flex-col lg:flex-row flex-1">
    <!-- Sidebar Filters -->
    <aside
      class="w-full lg:w-72 shrink-0 border-r border-[var(--ui-border)] bg-[var(--ui-bg)] p-6"
    >
      <div class="sticky top-6">
        <h2 class="text-xl font-bold mb-6 text-default">Filtry</h2>
        <HousePlanFilters
          :initial-filters="filters"
          @apply="handleApplyFilters"
          @clear="handleClearFilters"
        />
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6 lg:p-8 bg-[var(--ui-bg-elevated)]">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-default">Projekty domów</h1>
        <p class="text-muted mt-2">Znajdź swój wymarzony projekt domu</p>
      </div>

      <div
        v-if="status === 'pending'"
        class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
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
          />
        </div>
      </div>

      <div
        v-else
        class="text-center py-16 bg-[var(--ui-bg)] border border-[var(--ui-border)] rounded-xl"
      >
        <UIcon
          name="i-lucide-search-x"
          class="size-12 text-muted-foreground mx-auto mb-4"
        />
        <h3 class="text-lg font-medium">Brak wyników</h3>
        <p class="text-muted mt-1">
          Nie znaleziono projektów spełniających podane kryteria.
        </p>
        <UButton class="mt-4" variant="outline" @click="handleClearFilters">
          Wyczyść filtry
        </UButton>
      </div>
    </main>
  </div>
</template>
