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
</script>

<template>
  <UCarousel
    v-slot="{ item }"
    :items="displayImages"
    :arrows="mode === 'full' && displayImages.length > 1"
    :dots="displayImages.length > 1"
    :ui="{
      dots: mode === 'compact' ? 'bottom-1.5' : 'bottom-3',
      dot: mode === 'compact' ? 'size-1.5' : 'size-2',
    }"
    class="w-full h-full"
  >
    <img
      :src="item"
      class="w-full h-full object-cover"
      alt="zdjęcie projektu"
      :loading="mode === 'compact' ? 'lazy' : 'eager'"
    />
  </UCarousel>
</template>
