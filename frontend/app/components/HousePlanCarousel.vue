<script setup lang="ts">
import type { AppHousePlan } from '~/types/house-plan'

const props = defineProps<{ title: string, plans: AppHousePlan[] }>()

const trackRef = ref<HTMLElement | null>(null)
const idx = ref(0)

const scroll = (dir: 1 | -1) => {
  const max = props.plans.length - 2
  idx.value = idx.value + dir * 2 > max ? 0 : idx.value + dir * 2 < 0 ? max : idx.value + dir * 2
  const item = trackRef.value?.children[idx.value] as HTMLElement | undefined
  trackRef.value?.scrollTo({ left: item?.offsetLeft ?? 0, behavior: 'smooth' })
}
</script>

<template>
  <div>
    <h2 class="text-xl font-semibold text-default mb-4 mt-30">
      {{ title }}
    </h2>
    <div class="relative">
      <div
        ref="trackRef"
        class="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2"
      >
        <div
          v-for="plan in plans"
          :key="plan.id"
          class="snap-start shrink-0 w-[calc(50%-8px)]"
        >
          <HousePlanCard :plan="plan" />
        </div>
      </div>

      <button
        class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 size-8 rounded-full
               bg-default border border-muted shadow flex items-center justify-center
               hover:bg-elevated transition-colors cursor-pointer"
        @click="scroll(-1)"
      >
        <UIcon
          name="i-lucide-chevron-left"
          class="size-4"
        />
      </button>
      <button
        class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 size-8 rounded-full
               bg-default border border-muted shadow flex items-center justify-center
               hover:bg-elevated transition-colors cursor-pointer"
        @click="scroll(1)"
      >
        <UIcon
          name="i-lucide-chevron-right"
          class="size-4"
        />
      </button>
    </div>
  </div>
</template>
