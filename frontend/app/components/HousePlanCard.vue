<script setup lang="ts">
import type { AppHousePlan } from '~/types/house-plan'

defineProps<{
  plan: AppHousePlan
}>()

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    maximumFractionDigits: 0
  }).format(price)
}
</script>

<template>
  <UCard :ui="{ body: 'p-0', footer: 'p-4' }">
    <!-- Image Placeholder -->
    <div class="aspect-video bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center rounded-t-lg overflow-hidden">
      <NuxtImg v-if="plan?.img" :src="plan.img ?? '/imgs/home_plan1.jpg'" class="w-full h-full" alt="zdjęcie planu" />
    </div>
    <!-- Content -->
    <div class="p-4 space-y-4">
      <div>
        <h3 class="text-lg font-semibold truncate" :title="plan.title">
          {{ plan.title }}
        </h3>
        <p class="text-xl font-bold text-primary mt-1">
          {{ formatPrice(plan.price) }}
        </p>
      </div>

      <div class="grid grid-cols-2 gap-2 text-sm text-neutral-500 dark:text-neutral-400">
        <div class="flex items-center gap-1.5">
          <UIcon name="i-lucide-maximize" class="size-4" />
          <span>{{ plan.houseArea }} m²</span>
        </div>
        <div class="flex items-center gap-1.5">
          <UIcon name="i-lucide-door-open" class="size-4" />
          <span>{{ plan.rooms }} pokoje</span>
        </div>
        <div class="flex items-center gap-1.5">
          <UIcon name="i-lucide-bath" class="size-4" />
          <span>{{ plan.bathroomsAndWc }} łazienki</span>
        </div>
      </div>
    </div>

    <template #footer>
      <UButton
        block
        color="neutral"
        variant="subtle"
        :to="`/produkty/${plan.id}`"
      >
        Zobacz szczegóły
      </UButton>
    </template>
  </UCard>
</template>
