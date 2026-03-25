<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

type Order = {
  id: string
  plan: string
  buyer: string
  date: string
  status: string
  amount: string
}

const vendor = {
  name: 'Jan Kowalski',
  company: 'Projekty Domów Kowalski',
  since: '2023'
}

const stats = [
  { label: 'Opublikowane plany', value: '12', icon: 'i-lucide-layout-template', trend: '+2 w tym miesiącu' },
  { label: 'Zamówienia', value: '47', icon: 'i-lucide-shopping-bag', trend: '+8 w tym miesiącu' },
  { label: 'Przychód', value: '23 400 zł', icon: 'i-lucide-banknote', trend: '+1 200 zł w tym miesiącu' },
  { label: 'Średnia ocena', value: '4.8', icon: 'i-lucide-star', trend: 'z 23 opinii' }
]

const recentOrders: Order[] = [
  { id: '#2041', plan: 'Dom parterowy A1', buyer: 'Anna Nowak', date: '24.03.2026', status: 'Opłacone', amount: '599 zł' },
  { id: '#2040', plan: 'Willa z poddaszem B3', buyer: 'Piotr Wiśniewski', date: '23.03.2026', status: 'Opłacone', amount: '799 zł' },
  { id: '#2039', plan: 'Dom piętrowy C2', buyer: 'Maria Zielińska', date: '21.03.2026', status: 'Oczekuje', amount: '499 zł' },
  { id: '#2038', plan: 'Dom parterowy A1', buyer: 'Tomasz Krawczyk', date: '19.03.2026', status: 'Opłacone', amount: '599 zł' },
  { id: '#2037', plan: 'Bungalow D1', buyer: 'Katarzyna Lewandowska', date: '17.03.2026', status: 'Zwrot', amount: '349 zł' }
]

const myPlans = [
  { title: 'Dom parterowy A1', sales: 18, price: '599 zł', status: 'Aktywny' },
  { title: 'Willa z poddaszem B3', sales: 11, price: '799 zł', status: 'Aktywny' },
  { title: 'Dom piętrowy C2', sales: 9, price: '499 zł', status: 'Aktywny' },
  { title: 'Bungalow D1', sales: 6, price: '349 zł', status: 'Wersja robocza' },
  { title: 'Dom z garażem E2', sales: 3, price: '649 zł', status: 'Aktywny' }
]

const orderColumns: TableColumn<Order>[] = [
  { accessorKey: 'id', header: 'Nr' },
  { accessorKey: 'plan', header: 'Plan' },
  { accessorKey: 'buyer', header: 'Kupujący' },
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

const planStatusColor = (status: string) => status === 'Aktywny' ? 'success' : 'neutral'
</script>

<template>
  <UContainer class="py-8 space-y-8">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-4">
        <UAvatar
          :alt="vendor.name"
          size="xl"
          icon="i-lucide-user"
        />
        <div>
          <h1 class="text-2xl font-bold text-default">
            {{ vendor.company }}
          </h1>
          <p class="text-sm text-muted">
            {{ vendor.name }} · Sprzedawca od {{ vendor.since }}
          </p>
        </div>
      </div>
      <div class="flex gap-2">
        <UButton
          variant="outline"
          icon="i-lucide-settings"
          size="sm"
        >
          Ustawienia
        </UButton>
        <UButton
          icon="i-lucide-plus"
          size="sm"
        >
          Dodaj plan
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
      <!-- Recent orders -->
      <div class="space-y-3 xl:col-span-2">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-default">
            Ostatnie zamówienia
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
        <!-- My plans -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-default">
              Moje plany
            </h2>
            <UButton
              variant="ghost"
              size="xs"
              trailing-icon="i-lucide-arrow-right"
            >
              Zarządzaj
            </UButton>
          </div>
          <UCard>
            <ul class="divide-y divide-default">
              <li
                v-for="plan in myPlans"
                :key="plan.title"
                class="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <div class="min-w-0">
                  <p class="truncate text-sm font-medium text-default">
                    {{ plan.title }}
                  </p>
                  <p class="text-xs text-muted">
                    {{ plan.sales }} sprzedaży · {{ plan.price }}
                  </p>
                </div>
                <UBadge
                  :color="planStatusColor(plan.status)"
                  variant="subtle"
                  size="sm"
                  class="ml-2 shrink-0"
                >
                  {{ plan.status }}
                </UBadge>
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
                Nowy plan domu
              </UButton>
              <UButton
                block
                variant="soft"
                icon="i-lucide-image-plus"
                color="neutral"
              >
                Prześlij zdjęcia
              </UButton>
              <UButton
                block
                variant="soft"
                icon="i-lucide-bar-chart-2"
                color="neutral"
              >
                Statystyki sprzedaży
              </UButton>
              <UButton
                block
                variant="soft"
                icon="i-lucide-message-circle"
                color="neutral"
              >
                Wiadomości
                <template #trailing>
                  <UBadge
                    color="error"
                    size="sm"
                    class="-mr-1"
                  >
                    3
                  </UBadge>
                </template>
              </UButton>
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </UContainer>
</template>
