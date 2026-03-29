<script setup lang="ts">
import { useRoute, useAsyncData, createError } from '#imports'
import { useVendorService } from '~/composables/services/useVendorService'
import HousePlanCard from '~/components/HousePlanCard.vue'

const route = useRoute()
const id = route.params.id as string
const vendorService = useVendorService()

const [{ data: vendor, error }, { data: plans }] = await Promise.all([
  useAsyncData(`vendor-${id}`, () => vendorService.getVendor(id)),
  useAsyncData(`vendor-plans-${id}`, () => vendorService.getVendorHousePlans(id))
])

if (error.value || !vendor.value) {
  throw createError({ statusCode: 404, statusMessage: 'Sprzedawca nie znaleziony', fatal: true })
}

const planCount = vendor.value.house_plans_count
const planLabel = planCount === 1 ? 'projekt' : planCount < 5 ? 'projekty' : 'projektów'

const memberSince = vendor.value.created_at
  ? new Intl.DateTimeFormat('pl-PL', { year: 'numeric', month: 'long' }).format(new Date(vendor.value.created_at))
  : null
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
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

    <!-- Vendor Header -->
    <UCard class="mb-8">
      <div class="flex flex-col sm:flex-row items-start gap-6">
        <UAvatar
          :alt="vendor!.company_name"
          size="3xl"
          class="shrink-0"
        />
        <div class="flex-1 min-w-0">
          <h1 class="text-2xl font-bold text-default">{{ vendor!.company_name }}</h1>
          <p class="text-muted mt-1">{{ vendor!.first_name }} {{ vendor!.last_name }}</p>

          <div class="flex flex-wrap items-center gap-4 mt-4">
            <div
              v-if="vendor!.average_rating"
              class="flex items-center gap-1.5 text-sm"
            >
              <UIcon name="i-lucide-star" class="size-4 text-yellow-500" />
              <span class="font-medium text-default">{{ vendor!.average_rating.toFixed(1) }}</span>
              <span class="text-muted">ocena</span>
            </div>

            <div class="flex items-center gap-1.5 text-sm">
              <UIcon name="i-lucide-layout-grid" class="size-4 text-muted" />
              <span class="font-medium text-default">{{ planCount }}</span>
              <span class="text-muted">{{ planLabel }}</span>
            </div>

            <div v-if="memberSince" class="flex items-center gap-1.5 text-sm">
              <UIcon name="i-lucide-calendar" class="size-4 text-muted" />
              <span class="text-muted">Sprzedaje od {{ memberSince }}</span>
            </div>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Plans Section -->
    <div>
      <h2 class="text-xl font-bold text-default mb-6">
        Projekty w ofercie
      </h2>

      <div v-if="plans?.length" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <HousePlanCard
          v-for="plan in plans"
          :key="plan.id"
          :plan="plan"
        />
      </div>

      <div
        v-else
        class="text-center py-16 bg-[var(--ui-bg-elevated)] border border-[var(--ui-border)] rounded-xl"
      >
        <UIcon name="i-lucide-package-open" class="size-12 text-muted mx-auto mb-4" />
        <p class="text-muted">Ten sprzedawca nie ma jeszcze żadnych projektów w ofercie.</p>
      </div>
    </div>
  </div>
</template>
