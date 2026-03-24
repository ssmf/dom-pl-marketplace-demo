<script setup lang="ts">
import { ref, watch } from "vue";

export interface FilterState {
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  rooms?: number;
}

const props = defineProps<{
  initialFilters: FilterState;
}>();

const emit = defineEmits<{
  apply: [value: FilterState];
  clear: [];
}>();

const localState = ref<FilterState>({ ...props.initialFilters });

watch(
  () => props.initialFilters,
  (newFilters) => {
    localState.value = { ...newFilters };
  },
  { deep: true },
);

const applyFilters = () => {
  emit("apply", { ...localState.value });
};

const clearFilters = () => {
  localState.value = {};
  emit("clear");
};

const roomOptions = [
  { label: "Dowolne", value: undefined },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5+", value: 5 },
];
</script>

<template>
  <div class="space-y-6">
    <!-- Cena -->
    <UFormField label="Cena (PLN)">
      <div class="flex items-center gap-2">
        <UInput
          v-model.number="localState.minPrice"
          type="number"
          placeholder="Od"
          class="w-full"
        />
        <span class="text-neutral-500">-</span>
        <UInput
          v-model.number="localState.maxPrice"
          type="number"
          placeholder="Do"
          class="w-full"
        />
      </div>
    </UFormField>

    <!-- Powierzchnia -->
    <UFormField label="Powierzchnia (m²)">
      <div class="flex items-center gap-2">
        <UInput
          v-model.number="localState.minArea"
          type="number"
          placeholder="Od"
          class="w-full"
        />
        <span class="text-neutral-500">-</span>
        <UInput
          v-model.number="localState.maxArea"
          type="number"
          placeholder="Do"
          class="w-full"
        />
      </div>
    </UFormField>

    <!-- Pokoje -->
    <UFormField label="Liczba pokoi">
      <USelect v-model="localState.rooms" :items="roomOptions" class="w-full" />
    </UFormField>

    <!-- Akcje -->
    <div class="flex flex-col gap-2 pt-4">
      <UButton block @click="applyFilters"> Zastosuj filtry </UButton>
      <UButton block variant="ghost" color="neutral" @click="clearFilters">
        Wyczyść
      </UButton>
    </div>
  </div>
</template>
