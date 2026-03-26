<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { useCustomerService } from '~/composables/services/useCustomerService'

type Order = {
  id: string
  plan: string
  date: string
  status: string
  amount: string
}

const route = useRoute()
const { getCustomer } = useCustomerService()

const { data: customerData } = await useAsyncData(
  `customer-${route.query.id}`,
  () => getCustomer(route.query.id as string),
  { server: false }
)

const customer = computed(() => ({
  name: customerData.value ? `${customerData.value.first_name} ${customerData.value.last_name}` : '—',
  email: customerData.value?.email ?? '—',
  since: customerData.value?.created_at
    ? new Date(customerData.value.created_at).getFullYear().toString()
    : '—',
}))

const stats = [
  { label: 'Zamówienia', value: '5', icon: 'i-lucide-shopping-bag', trend: '2 w tym roku' },
  { label: 'Zapisane plany', value: '12', icon: 'i-lucide-heart', trend: '3 nowe w tym miesiącu' },
  { label: 'Wydane łącznie', value: '3 150 zł', icon: 'i-lucide-banknote', trend: 'od początku konta' },
  { label: 'Opinie', value: '3', icon: 'i-lucide-star', trend: 'wystawione oceny' }
]

const recentOrders: Order[] = [
  { id: '#2041', plan: 'Dom parterowy A1', date: '24.03.2026', status: 'Opłacone', amount: '599 zł' },
  { id: '#2039', plan: 'Dom piętrowy C2', date: '10.02.2026', status: 'Opłacone', amount: '499 zł' },
  { id: '#2031', plan: 'Willa z poddaszem B3', date: '05.01.2026', status: 'Opłacone', amount: '799 zł' },
  { id: '#2018', plan: 'Bungalow D1', date: '14.11.2025', status: 'Zwrot', amount: '349 zł' },
  { id: '#2005', plan: 'Dom z garażem E2', date: '02.09.2025', status: 'Opłacone', amount: '649 zł' }
]

const savedPlans = [
  { title: 'Dom nowoczesny F1', price: '699 zł', area: 120, rooms: 4 },
  { title: 'Dom skandynawski G2', price: '549 zł', area: 95, rooms: 3 },
  { title: 'Dom z tarasem H3', price: '849 zł', area: 145, rooms: 5 },
  { title: 'Dom energooszczędny I1', price: '620 zł', area: 110, rooms: 4 }
]

const orderColumns: TableColumn<Order>[] = [
  { accessorKey: 'id', header: 'Nr' },
  { accessorKey: 'plan', header: 'Plan' },
  { accessorKey: 'date', header: 'Data' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'amount', header: 'Kwota' }
]

const statusColor = (status: string) => {
  if (status === 'Opłacone') return 'success'
  if (status === 'Oczekuje') return 'warning'
  if (status === 'Zwrot') return 'error'
  return 'neutral'
}
</script>

<template>
  <UContainer class="py-8 space-y-8">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-4">
        <UAvatar
          :alt="customer.name"
          size="xl"
          icon="i-lucide-user"
        />
        <div>
          <h1 class="text-2xl font-bold text-default">
            {{ customer.name }}
          </h1>
          <p class="text-sm text-muted">
            {{ customer.email }} · Konto od {{ customer.since }}
          </p>
        </div>
      </div>
      <div class="flex gap-2">
        <UButton
          variant="outline"
          icon="i-lucide-settings"
          size="sm"
        >
          Ustawienia konta
        </UButton>
        <UButton
          icon="i-lucide-layout-template"
          size="sm"
          to="/produkty"
        >
          Przeglądaj plany
        </UButton>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <UCard
        v-for="stat in stats"
        :key="stat.label"
      >
        <div class="flex items-start justify-between">
          <div class="space-y-1">
            <p class="text-sm text-muted">
              {{ stat.label }}
            </p>
            <p class="text-2xl font-bold text-default">
              {{ stat.value }}
            </p>
            <p class="text-xs text-muted">
              {{ stat.trend }}
            </p>
          </div>
          <div class="rounded-lg bg-primary/10 p-2">
            <UIcon
              :name="stat.icon"
              class="size-5 text-primary"
            />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Main grid -->
    <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <!-- Orders -->
      <div class="space-y-3 xl:col-span-2">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-default">
            Moje zamówienia
          </h2>
          <UButton
            variant="ghost"
            size="xs"
            trailing-icon="i-lucide-arrow-right"
          >
            Wszystkie
          </UButton>
        </div>
        <UCard :ui="{ body: 'p-0' }">
          <UTable
            :columns="orderColumns"
            :data="recentOrders"
          >
            <template #status="{ row }">
              <UBadge
                :color="statusColor(row.original.status)"
                variant="subtle"
                size="sm"
              >
                {{ row.original.status }}
              </UBadge>
            </template>
            <template #amount="{ row }">
              <span class="font-medium text-default">
                {{ row.original.amount }}
              </span>
            </template>
          </UTable>
        </UCard>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Saved plans -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-default">
              Zapisane plany
            </h2>
            <UButton
              variant="ghost"
              size="xs"
              trailing-icon="i-lucide-arrow-right"
            >
              Wszystkie
            </UButton>
          </div>
          <UCard>
            <ul class="divide-y divide-default">
              <li
                v-for="plan in savedPlans"
                :key="plan.title"
                class="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <div class="min-w-0">
                  <p class="truncate text-sm font-medium text-default">
                    {{ plan.title }}
                  </p>
                  <p class="text-xs text-muted">
                    {{ plan.area }} m² · {{ plan.rooms }} pokoje
                  </p>
                </div>
                <div class="ml-2 flex shrink-0 items-center gap-2">
                  <span class="text-sm font-medium text-primary">
                    {{ plan.price }}
                  </span>
                  <UButton
                    variant="ghost"
                    size="xs"
                    icon="i-lucide-heart"
                    color="error"
                  />
                </div>
              </li>
            </ul>
          </UCard>
        </div>

        <!-- Quick actions -->
        <div class="space-y-3">
          <h2 class="text-lg font-semibold text-default">
            Szybkie akcje
          </h2>
          <UCard>
            <div class="space-y-2">
              <UButton
                block
                variant="soft"
                icon="i-lucide-layout-template"
              >
                Przeglądaj plany
              </UButton>
              <UButton
                block
                variant="soft"
                icon="i-lucide-download"
                color="neutral"
              >
                Pobierz dokumenty
              </UButton>
              <UButton
                block
                variant="soft"
                icon="i-lucide-message-circle"
                color="neutral"
              >
                Kontakt ze sprzedawcą
              </UButton>
              <UButton
                block
                variant="soft"
                icon="i-lucide-star"
                color="neutral"
              >
                Wystaw opinię
              </UButton>
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </UContainer>
</template>
