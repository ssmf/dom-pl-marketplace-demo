<script setup lang="ts">
const props = defineProps<{
  images: { id: string; url: string }[]
  thumbnail?: string | null
  mode?: 'compact' | 'full'
}>()

const mode = computed(() => props.mode ?? 'full')

const allImages = computed(() => {
  const urls: string[] = []
  if (props.thumbnail) urls.push(props.thumbnail)
  for (const img of props.images) {
    if (img.url !== props.thumbnail) urls.push(img.url)
  }
  if (urls.length === 0) urls.push('/imgs/home_plan1.jpg')
  return urls
})

const displayImages = computed(() =>
  mode.value === 'compact' ? allImages.value.slice(0, 4) : allImages.value
)

const hasMultiple = computed(() => displayImages.value.length > 1)

const carouselRef = useTemplateRef('carousel')

function scrollPrev() {
  carouselRef.value?.emblaApi?.scrollPrev()
}
function scrollNext() {
  carouselRef.value?.emblaApi?.scrollNext()
}
</script>

<template>
  <div class="relative w-full h-full group/gallery">
    <UCarousel
      ref="carousel"
      v-slot="{ item }"
      :items="displayImages"
      :dots="hasMultiple"
      :ui="{
        dots: mode === 'compact' ? 'bottom-1.5' : 'bottom-3',
        dot: mode === 'compact' ? 'size-1.5' : 'size-2'
      }"
      class="w-full h-full"
    >
      <img
        :src="item"
        class="w-full h-full object-cover"
        alt="zdjęcie projektu"
        :loading="mode === 'compact' ? 'lazy' : 'eager'"
      >
    </UCarousel>

    <template v-if="hasMultiple">
      <button
        type="button"
        aria-label="Poprzednie zdjęcie"
        :class="[
          'absolute top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/85 text-gray-800 shadow flex items-center justify-center cursor-pointer transition-opacity',
          mode === 'compact'
            ? 'left-1 size-6 opacity-0 group-hover/gallery:opacity-100'
            : 'left-2 size-9 opacity-70 hover:opacity-100'
        ]"
        @click.prevent="scrollPrev"
      >
        <UIcon
          :class="mode === 'compact' ? 'size-4' : 'size-5'"
          name="i-lucide-chevron-left"
        />
      </button>
      <button
        type="button"
        aria-label="Następne zdjęcie"
        :class="[
          'absolute top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/85 text-gray-800 shadow flex items-center justify-center cursor-pointer transition-opacity',
          mode === 'compact'
            ? 'right-1 size-6 opacity-0 group-hover/gallery:opacity-100'
            : 'right-2 size-9 opacity-70 hover:opacity-100'
        ]"
        @click.prevent="scrollNext"
      >
        <UIcon
          :class="mode === 'compact' ? 'size-4' : 'size-5'"
          name="i-lucide-chevron-right"
        />
      </button>
    </template>
  </div>
</template>
