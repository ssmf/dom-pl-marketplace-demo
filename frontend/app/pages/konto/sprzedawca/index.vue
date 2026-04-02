<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { useVendorService } from '~/composables/services/useVendorService'
import type { AppOrder } from '~/types/order'

type OrderRow = {
  id: string
  orderId: string
  products: string
  buyer: string
  date: string
  status: string
  amount: string
}

const emptyForm = () => ({
  title: '',
  price: '',
  description: '',
  img: '',
  house_area: '',
  boiler_room_area: '',
  rooms: '',
  bathrooms_and_wc: '',
  plot_dimensions: '',
  min_plot_dimensions_after_adaptation: '',
  floors: '',
  building_width: '',
  building_length: '',
  building_footprint: '',
  total_area: '',
  roof_type: '',
  roof_angle: '',
  garage: '',
  architectural_style: '',
  energy_standard: '',
  basement: '',
  building_height: '',
  fireplace: '',
  terrace: '',
  house_type: ''
})

type PlanForm = ReturnType<typeof emptyForm>

const numOrNull = (val: string) =>
  val && !isNaN(Number(val)) ? Number(val) : undefined

const route = useRoute()
const toast = useToast()
const { getVendor, getVendorHousePlans, getVendorOrders, createVendorHousePlan, deleteVendorHousePlan } = useVendorService()

const slideoverOpen = ref(false)
const submitting = ref(false)
const form = ref<PlanForm>(emptyForm())
const formErrors = ref<Partial<PlanForm>>({})

function validateForm(): boolean {
  const e: Partial<PlanForm> = {}
  if (!form.value.title.trim()) e.title = 'Tytuł jest wymagany'
  if (!form.value.price || isNaN(Number(form.value.price))) e.price = 'Podaj poprawną cenę'
  if (!form.value.house_area || isNaN(Number(form.value.house_area))) e.house_area = 'Podaj powierzchnię'
  if (!form.value.rooms || isNaN(Number(form.value.rooms))) e.rooms = 'Podaj liczbę pokoi'
  if (!form.value.bathrooms_and_wc || isNaN(Number(form.value.bathrooms_and_wc))) e.bathrooms_and_wc = 'Podaj liczbę łazienek'
  if (!form.value.plot_dimensions.trim()) e.plot_dimensions = 'Wymiary działki są wymagane'
  formErrors.value = e
  return Object.keys(e).length === 0
}

async function submitPlan() {
  if (!validateForm()) return
  submitting.value = true
  try {
    await createVendorHousePlan(route.query.id as string, {
      title: form.value.title.trim(),
      price: Number(form.value.price),
      house_area: Number(form.value.house_area),
      rooms: Number(form.value.rooms),
      bathrooms_and_wc: Number(form.value.bathrooms_and_wc),
      plot_dimensions: form.value.plot_dimensions.trim(),
      ...(form.value.description.trim() && { description: form.value.description.trim() }),
      ...(form.value.img.trim() && { img: form.value.img.trim() }),
      ...(form.value.boiler_room_area && !isNaN(Number(form.value.boiler_room_area)) && { boiler_room_area: Number(form.value.boiler_room_area) }),
      ...(form.value.min_plot_dimensions_after_adaptation.trim() && { min_plot_dimensions_after_adaptation: form.value.min_plot_dimensions_after_adaptation.trim() }),
      ...(numOrNull(form.value.floors) !== undefined && { floors: numOrNull(form.value.floors) }),
      ...(numOrNull(form.value.building_width) !== undefined && { building_width: numOrNull(form.value.building_width) }),
      ...(numOrNull(form.value.building_length) !== undefined && { building_length: numOrNull(form.value.building_length) }),
      ...(numOrNull(form.value.building_footprint) !== undefined && { building_footprint: numOrNull(form.value.building_footprint) }),
      ...(numOrNull(form.value.total_area) !== undefined && { total_area: numOrNull(form.value.total_area) }),
      ...(numOrNull(form.value.building_height) !== undefined && { building_height: numOrNull(form.value.building_height) }),
      ...(numOrNull(form.value.roof_angle) !== undefined && { roof_angle: numOrNull(form.value.roof_angle) }),
      ...(form.value.roof_type && { roof_type: form.value.roof_type }),
      ...(form.value.garage && { garage: form.value.garage }),
      ...(form.value.architectural_style && { architectural_style: form.value.architectural_style }),
      ...(form.value.energy_standard && { energy_standard: form.value.energy_standard }),
      ...(form.value.basement && { basement: form.value.basement }),
      ...(form.value.house_type && { house_type: form.value.house_type }),
      ...(form.value.fireplace === 'tak' && { fireplace: true }),
      ...(form.value.fireplace === 'nie' && { fireplace: false }),
      ...(form.value.terrace === 'tak' && { terrace: true }),
      ...(form.value.terrace === 'nie' && { terrace: false }),
    })
    toast.add({ title: 'Plan dodany', description: 'Plan domu został opublikowany.', color: 'success' })
    slideoverOpen.value = false
    form.value = emptyForm()
    await Promise.all([
      refreshNuxtData(`vendor-${route.query.id}`),
      refreshNuxtData(`vendor-house-plans-${route.query.id}`)
    ])
  } catch {
    toast.add({ title: 'Błąd', description: 'Nie udało się dodać planu.', color: 'error' })
  } finally {
    submitting.value = false
  }
}

const { data: vendorData } = await useAsyncData(
  `vendor-${route.query.id}`,
  () => getVendor(route.query.id as string),
  { server: false }
)

const { data: ordersData, pending: ordersPending } = useAsyncData(
  `vendor-orders-${route.query.id}`,
  () => getVendorOrders(route.query.id as string),
  { server: false }
)

const vendor = computed(() => ({
  name: vendorData.value ? `${vendorData.value.first_name} ${vendorData.value.last_name}` : '—',
  company: vendorData.value?.company_name ?? '—',
  createdAt: vendorData.value?.created_at
    ? vendorData.value.created_at.slice(0, 10).split('-').reverse().join('.')
    : '—'
}))

const formatPLN = (value: number) =>
  value.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 })

const ordersCount = computed(() => ordersData.value?.length ?? 0)

const stats = computed(() => [
  {
    label: 'Plany domów',
    value: String(vendorData.value?.house_plans_count ?? '—'),
    icon: 'i-lucide-layout-template',
    trend: ''
  },
  {
    label: 'Zamówienia',
    value: String(ordersCount.value),
    icon: 'i-lucide-shopping-bag',
    trend: ''
  },
  {
    label: 'Przychód',
    value: ordersData.value
      ? formatPLN((ordersData.value).reduce((sum, o) => sum + Number(o.total), 0))
      : '—',
    icon: 'i-lucide-banknote',
    trend: ''
  },
  {
    label: 'Średnia ocena',
    value: vendorData.value?.average_rating != null ? String(vendorData.value.average_rating) : '—',
    icon: 'i-lucide-star',
    trend: ''
  }
])

const statusLabel = (status: string) => {
  const map: Record<string, string> = {
    completed: 'Opłacone',
    pending: 'Oczekuje',
    cancelled: 'Anulowane',
    canceled: 'Anulowane',
    requires_action: 'Wymaga akcji'
  }
  return map[status] ?? status
}

const recentOrders = computed<OrderRow[]>(() =>
  (ordersData.value ?? []).slice(0, 10).map((o: AppOrder) => {
    const itemTotal = o.items.reduce((sum, i) => sum + Number(i.unit_price) * Number(i.quantity), 0)
    const total = Number(o.total)
    return {
      id: '#' + o.id.slice(-6).toUpperCase(),
      orderId: o.id,
      products: o.items.length === 1
        ? (o.items[0]?.title ?? '—')
        : `${o.items.length} produkty`,
      buyer: o.email ?? '—',
      date: new Date(o.created_at).toLocaleDateString('pl-PL'),
      status: statusLabel(o.status),
      amount: formatPLN(total > 0 ? total : itemTotal)
    }
  })
)

const { data: housePlansData } = await useAsyncData(
  `vendor-house-plans-${route.query.id}`,
  () => getVendorHousePlans(route.query.id as string),
  { server: false }
)

const myPlans = computed(() =>
  (housePlansData.value ?? []).map(plan => ({
    id: plan.id,
    title: plan.title,
    price: formatPLN(plan.price)
  }))
)

async function deletePlan(planId: string) {
  if (!confirm('Czy na pewno chcesz usunąć ten plan?')) return
  try {
    await deleteVendorHousePlan(route.query.id as string, planId)
    toast.add({ title: 'Plan usunięty', color: 'success' })
    await Promise.all([
      refreshNuxtData(`vendor-${route.query.id}`),
      refreshNuxtData(`vendor-house-plans-${route.query.id}`)
    ])
  } catch {
    toast.add({ title: 'Błąd', description: 'Nie udało się usunąć planu.', color: 'error' })
  }
}

const orderColumns: TableColumn<OrderRow>[] = [
  { accessorKey: 'id', header: 'Nr' },
  { accessorKey: 'products', header: 'Produkt(y)' },
  { accessorKey: 'buyer', header: 'Kupujący' },
  { accessorKey: 'date', header: 'Data' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'amount', header: 'Kwota' },
  { accessorKey: 'actions', header: '' }
]

const statusColor = (status: string) => {
  if (status === 'Opłacone') return 'success'
  if (status === 'Oczekuje') return 'warning'
  if (status === 'Anulowane') return 'error'
  return 'neutral'
}
</script>

<template>
  <div>
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
              {{ vendor.name }} · Sprzedawca od {{ vendor.createdAt }}
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
            class="cursor-pointer"
            @click="slideoverOpen = true"
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
          <h2 class="text-lg font-semibold text-default">
            Ostatnie zamówienia
          </h2>

          <div
            v-if="ordersPending"
            class="flex justify-center py-8"
          >
            <UIcon
              name="i-lucide-loader-2"
              class="size-6 animate-spin text-muted"
            />
          </div>

          <template v-else-if="recentOrders.length">
            <UCard :ui="{ body: 'p-0' }">
              <UTable
                :columns="orderColumns"
                :data="recentOrders"
              >
                <template #status-cell="{ row }">
                  <UBadge
                    :color="statusColor(row.original.status)"
                    variant="subtle"
                    size="sm"
                  >
                    {{ row.original.status }}
                  </UBadge>
                </template>
                <template #amount-cell="{ row }">
                  <span class="font-medium text-default">
                    {{ row.original.amount }}
                  </span>
                </template>
                <template #actions-cell="{ row }">
                  <UButton
                    variant="ghost"
                    size="xs"
                    icon="i-lucide-eye"
                    :to="`/konto/sprzedawca/zamowienie/${row.original.orderId}?vendorId=${route.query.id}`"
                  >
                    Szczegóły
                  </UButton>
                </template>
              </UTable>
            </UCard>
          </template>

          <UCard v-else>
            <p class="text-sm text-muted text-center py-4">
              Brak zamówień na Twoje plany.
            </p>
          </UCard>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- My plans -->
          <div class="space-y-3">
            <h2 class="text-lg font-semibold text-default">
              Moje plany
            </h2>
            <UCard>
              <p
                v-if="!myPlans.length"
                class="text-sm text-muted"
              >
                Nie masz jeszcze żadnych planów.
              </p>
              <ul
                v-else
                class="divide-y divide-default"
              >
                <li
                  v-for="plan in myPlans"
                  :key="plan.id"
                  class="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <NuxtLink
                    :to="`/produkty/${plan.id}`"
                    class="min-w-0 flex-1 group"
                  >
                    <p class="truncate text-sm font-medium text-default group-hover:text-primary transition-colors">
                      {{ plan.title }}
                    </p>
                    <p class="text-xs text-muted">
                      {{ plan.price }}
                    </p>
                  </NuxtLink>
                  <UButton
                    variant="ghost"
                    color="error"
                    icon="i-lucide-trash-2"
                    size="xs"
                    class="cursor-pointer shrink-0 ml-2"
                    @click="deletePlan(plan.id)"
                  />
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
                  @click="slideoverOpen = true"
                >
                  Nowy plan domu
                </UButton>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </UContainer>

    <USlideover v-model:open="slideoverOpen" title="Nowy plan domu">
      <template #body>
        <div class="space-y-4 p-4">
          <div class="space-y-1">
            <label class="text-sm font-medium text-default">Tytuł *</label>
            <UInput v-model="form.title" placeholder="np. Dom Parterowy 120" @input="formErrors.title = undefined" />
            <p v-if="formErrors.title" class="text-xs text-error">{{ formErrors.title }}</p>
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-default">Cena (PLN) *</label>
            <UInput v-model="form.price" type="number" placeholder="2990" @input="formErrors.price = undefined" />
            <p v-if="formErrors.price" class="text-xs text-error">{{ formErrors.price }}</p>
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-default">Opis</label>
            <UTextarea v-model="form.description" placeholder="Opis projektu..." :rows="3" />
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-default">URL zdjęcia</label>
            <UInput v-model="form.img" placeholder="https://..." />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="text-sm font-medium text-default">Pow. domu (m²) *</label>
              <UInput v-model="form.house_area" type="number" placeholder="120" @input="formErrors.house_area = undefined" />
              <p v-if="formErrors.house_area" class="text-xs text-error">{{ formErrors.house_area }}</p>
            </div>
            <div class="space-y-1">
              <label class="text-sm font-medium text-default">Pow. kotłowni (m²)</label>
              <UInput v-model="form.boiler_room_area" type="number" placeholder="8" />
            </div>
            <div class="space-y-1">
              <label class="text-sm font-medium text-default">Pokoje *</label>
              <UInput v-model="form.rooms" type="number" placeholder="4" @input="formErrors.rooms = undefined" />
              <p v-if="formErrors.rooms" class="text-xs text-error">{{ formErrors.rooms }}</p>
            </div>
            <div class="space-y-1">
              <label class="text-sm font-medium text-default">Łazienki i WC *</label>
              <UInput v-model="form.bathrooms_and_wc" type="number" placeholder="2" @input="formErrors.bathrooms_and_wc = undefined" />
              <p v-if="formErrors.bathrooms_and_wc" class="text-xs text-error">{{ formErrors.bathrooms_and_wc }}</p>
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-default">Wymiary działki (np. 15x20) *</label>
            <UInput v-model="form.plot_dimensions" placeholder="15x20" @input="formErrors.plot_dimensions = undefined" />
            <p v-if="formErrors.plot_dimensions" class="text-xs text-error">{{ formErrors.plot_dimensions }}</p>
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-default">Min. wymiary po adaptacji</label>
            <UInput v-model="form.min_plot_dimensions_after_adaptation" placeholder="12x18" />
          </div>

          <!-- Bryła budynku -->
          <p class="text-sm font-semibold text-default pt-2">Bryła budynku</p>
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="text-sm font-medium text-default">Kondygnacje</label>
              <UInput v-model="form.floors" type="number" placeholder="2" />
            </div>
            <div class="space-y-1">
              <label class="text-sm font-medium text-default">Wysokość (m)</label>
              <UInput v-model="form.building_height" type="number" placeholder="8.5" />
            </div>
            <div class="space-y-1">
              <label class="text-sm font-medium text-default">Szerokość (m)</label>
              <UInput v-model="form.building_width" type="number" placeholder="11.5" />
            </div>
            <div class="space-y-1">
              <label class="text-sm font-medium text-default">Długość (m)</label>
              <UInput v-model="form.building_length" type="number" placeholder="9.5" />
            </div>
            <div class="space-y-1">
              <label class="text-sm font-medium text-default">Pow. zabudowy (m²)</label>
              <UInput v-model="form.building_footprint" type="number" placeholder="72" />
            </div>
            <div class="space-y-1">
              <label class="text-sm font-medium text-default">Pow. całkowita (m²)</label>
              <UInput v-model="form.total_area" type="number" placeholder="138" />
            </div>
          </div>

          <!-- Dach -->
          <p class="text-sm font-semibold text-default pt-2">Dach</p>
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="text-sm font-medium text-default">Rodzaj dachu</label>
              <USelect
                v-model="form.roof_type"
                :items="[
                  { label: 'Dwuspadowy', value: 'dwuspadowy' },
                  { label: 'Czterospadowy', value: 'czterospadowy' },
                  { label: 'Płaski', value: 'płaski' },
                  { label: 'Mansardowy', value: 'mansardowy' },
                  { label: 'Jednospadowy', value: 'jednospadowy' },
                ]"
                placeholder="Wybierz..."
              />
            </div>
            <div class="space-y-1">
              <label class="text-sm font-medium text-default">Kąt nachylenia (°)</label>
              <UInput v-model="form.roof_angle" type="number" placeholder="35" />
            </div>
          </div>

          <!-- Wyposażenie -->
          <p class="text-sm font-semibold text-default pt-2">Wyposażenie</p>
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="text-sm font-medium text-default">Garaż</label>
              <USelect
                v-model="form.garage"
                :items="[
                  { label: 'Brak', value: 'brak' },
                  { label: 'Jednostanowiskowy', value: 'jednostanowiskowy' },
                  { label: 'Dwustanowiskowy', value: 'dwustanowiskowy' },
                  { label: 'Trzystanowiskowy', value: 'trzystanowiskowy' },
                ]"
                placeholder="Wybierz..."
              />
            </div>
            <div class="space-y-1">
              <label class="text-sm font-medium text-default">Piwnica</label>
              <USelect
                v-model="form.basement"
                :items="[
                  { label: 'Brak', value: 'brak' },
                  { label: 'Częściowa', value: 'częściowa' },
                  { label: 'Pełna', value: 'pełna' },
                ]"
                placeholder="Wybierz..."
              />
            </div>
            <div class="space-y-1">
              <label class="text-sm font-medium text-default">Kominek</label>
              <USelect
                v-model="form.fireplace"
                :items="[{ label: 'Tak', value: 'tak' }, { label: 'Nie', value: 'nie' }]"
                placeholder="Wybierz..."
              />
            </div>
            <div class="space-y-1">
              <label class="text-sm font-medium text-default">Taras</label>
              <USelect
                v-model="form.terrace"
                :items="[{ label: 'Tak', value: 'tak' }, { label: 'Nie', value: 'nie' }]"
                placeholder="Wybierz..."
              />
            </div>
          </div>

          <!-- Styl i standard -->
          <p class="text-sm font-semibold text-default pt-2">Styl i standard</p>
          <div class="grid grid-cols-1 gap-3">
            <div class="space-y-1">
              <label class="text-sm font-medium text-default">Typ domu</label>
              <USelect
                v-model="form.house_type"
                :items="[
                  { label: 'Jednorodzinny', value: 'jednorodzinny' },
                  { label: 'Bliźniak', value: 'bliźniak' },
                  { label: 'Rekreacyjny', value: 'rekreacyjny' },
                ]"
                placeholder="Wybierz..."
              />
            </div>
            <div class="space-y-1">
              <label class="text-sm font-medium text-default">Styl architektoniczny</label>
              <USelect
                v-model="form.architectural_style"
                :items="[
                  { label: 'Tradycyjny', value: 'tradycyjny' },
                  { label: 'Nowoczesny', value: 'nowoczesny' },
                  { label: 'Klasyczny', value: 'klasyczny' },
                  { label: 'Skandynawski', value: 'skandynawski' },
                ]"
                placeholder="Wybierz..."
              />
            </div>
            <div class="space-y-1">
              <label class="text-sm font-medium text-default">Standard energetyczny</label>
              <USelect
                v-model="form.energy_standard"
                :items="[
                  { label: 'Standard', value: 'standard' },
                  { label: 'Energooszczędny', value: 'energooszczędny' },
                  { label: 'Pasywny', value: 'pasywny' },
                ]"
                placeholder="Wybierz..."
              />
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2 p-4">
          <UButton
            variant="outline"
            :disabled="submitting"
            class="cursor-pointer"
            @click="slideoverOpen = false"
          >
            Anuluj
          </UButton>
          <UButton
            :loading="submitting"
            class="cursor-pointer"
            @click="submitPlan"
          >
            Opublikuj plan
          </UButton>
        </div>
      </template>
    </USlideover>
  </div>
</template>
