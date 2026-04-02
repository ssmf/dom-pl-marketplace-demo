<template>
  <section>
    <h2 class="text-xl font-bold text-default mb-5">
      {{ label }}
    </h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      <button
        v-for="tile in tiles"
        :key="tile.label"
        class="group flex flex-col rounded-xl border border-muted bg-default hover:border-primary hover:shadow-md transition-all cursor-pointer overflow-hidden text-left"
      >
        <div class="w-full aspect-3/2 bg-elevated flex items-center justify-center">
          <UIcon
            :name="tile.icon ?? icon"
            class="size-12 text-muted group-hover:text-primary transition-colors"
          />
        </div>
        <div class="px-3 py-2">
          <span class="text-sm font-medium text-default leading-tight">
            {{ tile.label }}
          </span>
        </div>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  icon: string
  tiles: { label: string; icon?: string }[]
}>()
</script>
