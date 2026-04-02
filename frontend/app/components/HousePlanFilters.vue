<script setup lang="ts">
import { ref, watch } from 'vue'
import type { HousePlanListParams } from '~/composables/services/useHousePlanService'

const props = defineProps<{
  initialFilters: HousePlanListParams
}>()

const emit = defineEmits<{
  apply: [value: HousePlanListParams]
  clear: []
}>()

const localState = ref<HousePlanListParams>({ ...props.initialFilters })

watch(
  () => props.initialFilters,
  (newFilters) => { localState.value = { ...newFilters } },
  { deep: true }
)

const applyFilters = () => emit('apply', { ...localState.value })
const clearFilters = () => {
  localState.value = {}
  emit('clear')
}

const roomOptions = [
  { label: 'Dowolna', value: undefined },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '6 i więcej', value: 6 }
]

const floorsOptions = [
  { label: 'Dowolna', value: undefined },
  { label: 'Parterowy', value: 1 },
  { label: 'Piętrowy', value: 2 },
  { label: 'Trzykondygnacyjny', value: 3 }
]

const garageOptions = [
  { label: 'Dowolny', value: undefined },
  { label: 'Bez garażu', value: 'brak' },
  { label: 'Jednostanowiskowy', value: 'jednostanowiskowy' },
  { label: 'Dwustanowiskowy', value: 'dwustanowiskowy' },
  { label: 'Trzystanowiskowy', value: 'trzystanowiskowy' }
]

const basementOptions = [
  { label: 'Dowolna', value: undefined },
  { label: 'Bez piwnicy', value: 'brak' },
  { label: 'Częściowa', value: 'częściowa' },
  { label: 'Pełna', value: 'pełna' }
]

const styleOptions = [
  { label: 'Dowolny', value: undefined },
  { label: 'Tradycyjny', value: 'tradycyjny' },
  { label: 'Nowoczesny', value: 'nowoczesny' },
  { label: 'Klasyczny', value: 'klasyczny' },
  { label: 'Skandynawski', value: 'skandynawski' }
]

const energyOptions = [
  { label: 'Dowolny', value: undefined },
  { label: 'Standard', value: 'standard' },
  { label: 'Energooszczędny', value: 'energooszczędny' },
  { label: 'Pasywny', value: 'pasywny' }
]
</script>

<template>
  <div class="space-y-5">
    <!-- Cena -->
    <div>
      <p class="text-sm font-semibold text-default mb-2">Cena (PLN)</p>
      <div class="flex items-center gap-2">
        <UInput
          v-model.number="localState.minPrice"
          type="number"
          placeholder="Od"
          class="w-full"
        />
        <span class="text-muted">–</span>
        <UInput
          v-model.number="localState.maxPrice"
          type="number"
          placeholder="Do"
          class="w-full"
        />
      </div>
    </div>

    <!-- Powierzchnia -->
    <div>
      <p class="text-sm font-semibold text-default mb-2">Powierzchnia (m²)</p>
      <div class="flex items-center gap-2">
        <UInput
          v-model.number="localState.minArea"
          type="number"
          placeholder="Od"
          class="w-full"
        />
        <span class="text-muted">–</span>
        <UInput
          v-model.number="localState.maxArea"
          type="number"
          placeholder="Do"
          class="w-full"
        />
      </div>
    </div>

    <USeparator />

    <!-- Liczba pokoi -->
    <div>
      <p class="text-sm font-semibold text-default mb-2">Liczba pokoi</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="opt in roomOptions"
          :key="String(opt.value)"
          class="px-3 py-1.5 rounded-lg border text-sm transition-colors"
          :class="localState.rooms === opt.value
            ? 'border-primary bg-primary/10 text-primary font-medium'
            : 'border-muted bg-default text-default hover:border-primary'"
          @click="localState.rooms = opt.value"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <!-- Kondygnacje -->
    <div>
      <p class="text-sm font-semibold text-default mb-2">Kondygnacje</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="opt in floorsOptions"
          :key="String(opt.value)"
          class="px-3 py-1.5 rounded-lg border text-sm transition-colors"
          :class="localState.floors === opt.value
            ? 'border-primary bg-primary/10 text-primary font-medium'
            : 'border-muted bg-default text-default hover:border-primary'"
          @click="localState.floors = opt.value"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <USeparator />

    <!-- Garaż -->
    <div>
      <p class="text-sm font-semibold text-default mb-2">Garaż</p>
      <USelect
        v-model="localState.garage"
        :items="garageOptions"
        value-key="value"
        label-key="label"
        class="w-full"
      />
    </div>

    <!-- Piwnica -->
    <div>
      <p class="text-sm font-semibold text-default mb-2">Piwnica</p>
      <USelect
        v-model="localState.basement"
        :items="basementOptions"
        value-key="value"
        label-key="label"
        class="w-full"
      />
    </div>

    <USeparator />

    <!-- Styl architektoniczny -->
    <div>
      <p class="text-sm font-semibold text-default mb-2">Styl architektoniczny</p>
      <USelect
        v-model="localState.architecturalStyle"
        :items="styleOptions"
        value-key="value"
        label-key="label"
        class="w-full"
      />
    </div>

    <!-- Standard energetyczny -->
    <div>
      <p class="text-sm font-semibold text-default mb-2">Standard energetyczny</p>
      <USelect
        v-model="localState.energyStandard"
        :items="energyOptions"
        value-key="value"
        label-key="label"
        class="w-full"
      />
    </div>

    <USeparator />

    <!-- Akcje -->
    <div class="flex flex-col gap-2">
      <UButton block @click="applyFilters">
        Zastosuj filtry
      </UButton>
      <UButton block variant="ghost" color="neutral" @click="clearFilters">
        Wyczyść
      </UButton>
    </div>
  </div>
</template>
