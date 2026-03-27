<script setup lang="ts">
import { useRoute, useAsyncData, createError } from '#imports'
import { useHousePlanService } from '~/composables/services/useHousePlanService'

const route = useRoute()
const id = route.params.id as string

const housePlanService = useHousePlanService()

const { data: plan, error } = await useAsyncData(
  `house-plan-${id}`,
  () => housePlanService.getHousePlan(id)
)

if (error.value || !plan.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Projekt nie znaleziony',
    fatal: true
  })
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    maximumFractionDigits: 0
  }).format(price)
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
    <!-- Back Button -->
    <div class="mb-6">
      <UButton
        to="/produkty"
        color="neutral"
        variant="ghost"
        icon="i-lucide-arrow-left"
      >
        Wróć do projektów
      </UButton>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <!-- Left Column: Image and Description -->
      <div class="space-y-8">
        <div class="aspect-video bg-[var(--ui-bg-elevated)] flex items-center justify-center rounded-xl overflow-hidden border border-[var(--ui-border)]">
          <NuxtImg
            v-if="plan?.img"
            :src="plan.img"
            class="w-full h-full object-cover"
            alt="Wizualizacja projektu"
          />
          <NuxtImg
            v-else
            src="/imgs/home_plan1.jpg"
            class="w-full h-full object-cover opacity-50"
            alt="Brak zdjęcia"
          />
        </div>

        <div v-if="plan?.description" class="prose dark:prose-invert max-w-none text-muted">
          <h2 class="text-xl font-semibold text-default mb-4">Opis projektu</h2>
          <p class="whitespace-pre-line">{{ plan.description }}</p>
        </div>
      </div>

      <!-- Right Column: Details and Action -->
      <div class="space-y-8">
        <div>
          <h1 class="text-3xl font-bold text-default mb-2">{{ plan?.title }}</h1>
          <p class="text-3xl font-bold text-primary">{{ formatPrice(plan?.price ?? 0) }}</p>
        </div>

        <!-- Vendor Card -->
        <UCard v-if="plan?.vendor">
          <template #header>
            <h3 class="text-lg font-semibold">Sprzedawca</h3>
          </template>

          <div class="flex items-start gap-4">
            <UAvatar
              :alt="plan.vendor.company_name"
              size="lg"
            />
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-default truncate">{{ plan.vendor.company_name }}</p>
              <p class="text-sm text-muted">{{ plan.vendor.first_name }} {{ plan.vendor.last_name }}</p>
              <div class="flex items-center gap-3 mt-2">
                <div v-if="plan.vendor.average_rating" class="flex items-center gap-1 text-sm text-muted">
                  <UIcon name="i-lucide-star" class="size-4 text-yellow-500" />
                  <span>{{ plan.vendor.average_rating.toFixed(1) }}</span>
                </div>
                <div class="flex items-center gap-1 text-sm text-muted">
                  <UIcon name="i-lucide-layout-grid" class="size-4" />
                  <span>{{ plan.vendor.house_plans_count }} {{ plan.vendor.house_plans_count === 1 ? 'projekt' : 'projektów' }}</span>
                </div>
              </div>
            </div>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Szczegóły projektu</h3>
          </template>

          <div class="space-y-4">
            <div class="flex items-center justify-between py-2 border-b border-[var(--ui-border)] last:border-0">
              <div class="flex items-center gap-2 text-muted">
                <UIcon name="i-lucide-maximize" class="size-5" />
                <span>Powierzchnia użytkowa</span>
              </div>
              <span class="font-medium text-default">{{ plan?.houseArea }} m²</span>
            </div>

            <div v-if="plan?.boilerRoomArea" class="flex items-center justify-between py-2 border-b border-[var(--ui-border)] last:border-0">
              <div class="flex items-center gap-2 text-muted">
                <UIcon name="i-lucide-thermometer" class="size-5" />
                <span>Powierzchnia kotłowni</span>
              </div>
              <span class="font-medium text-default">{{ plan?.boilerRoomArea }} m²</span>
            </div>

            <div class="flex items-center justify-between py-2 border-b border-[var(--ui-border)] last:border-0">
              <div class="flex items-center gap-2 text-muted">
                <UIcon name="i-lucide-door-open" class="size-5" />
                <span>Liczba pokoi</span>
              </div>
              <span class="font-medium text-default">{{ plan?.rooms }}</span>
            </div>

            <div class="flex items-center justify-between py-2 border-b border-[var(--ui-border)] last:border-0">
              <div class="flex items-center gap-2 text-muted">
                <UIcon name="i-lucide-bath" class="size-5" />
                <span>Łazienki i WC</span>
              </div>
              <span class="font-medium text-default">{{ plan?.bathroomsAndWc }}</span>
            </div>

            <div class="flex items-center justify-between py-2 border-b border-[var(--ui-border)] last:border-0">
              <div class="flex items-center gap-2 text-muted">
                <UIcon name="i-lucide-ruler" class="size-5" />
                <span>Min. wymiary działki</span>
              </div>
              <span class="font-medium text-default">{{ plan?.plotDimensions }}</span>
            </div>
            
            <div v-if="plan?.minPlotDimensionsAfterAdaptation" class="flex items-center justify-between py-2 border-b border-[var(--ui-border)] last:border-0">
              <div class="flex items-center gap-2 text-muted">
                <UIcon name="i-lucide-ruler" class="size-5" />
                <span>Wymiary po adaptacji</span>
              </div>
              <span class="font-medium text-default">{{ plan?.minPlotDimensionsAfterAdaptation }}</span>
            </div>
          </div>

          <template #footer>
            <UButton
              block
              size="lg"
              icon="i-lucide-shopping-cart"
            >
              Kup projekt
            </UButton>
          </template>
        </UCard>
      </div>
    </div>
  </div>
</template>
