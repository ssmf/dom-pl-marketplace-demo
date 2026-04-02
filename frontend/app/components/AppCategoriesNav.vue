<template>
  <div class="border-b border-default bg-default">
    <UContainer>
      <nav class="flex items-center gap-1 h-11 overflow-x-auto scrollbar-none">
        <UButton
          to="/produkty"
          variant="ghost"
          color="neutral"
          size="sm"
          class="shrink-0"
        >
          Wszystkie projekty
        </UButton>

        <UDropdownMenu
          v-for="group in categories"
          :key="group.label"
          :items="group.items"
          :content="{ side: 'bottom', align: 'start', sideOffset: 4 }"
        >
          <UButton
            variant="ghost"
            color="neutral"
            size="sm"
            trailing-icon="i-lucide-chevron-down"
            class="shrink-0"
          >
            {{ group.label }}
          </UButton>
        </UDropdownMenu>
      </nav>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { resolveComponent } from 'vue'

const NuxtLink = resolveComponent('NuxtLink')

const categories = [
  {
    label: 'Kondygnacje',
    items: [
      [
        { label: 'Domy parterowe', as: NuxtLink, to: '/produkty?floors=1' },
        { label: 'Domy piętrowe', as: NuxtLink, to: '/produkty?floors=2' }
      ]
    ]
  },
  {
    label: 'Powierzchnia',
    items: [
      [
        { label: 'Do 80 m²', as: NuxtLink, to: '/produkty?maxArea=80' },
        { label: 'Do 100 m²', as: NuxtLink, to: '/produkty?maxArea=100' },
        { label: 'Do 120 m²', as: NuxtLink, to: '/produkty?maxArea=120' },
        { label: 'Powyżej 150 m²', as: NuxtLink, to: '/produkty?minArea=150' }
      ]
    ]
  },
  {
    label: 'Styl',
    items: [
      [
        { label: 'Tradycyjny', as: NuxtLink, to: '/produkty?architecturalStyle=tradycyjny' },
        { label: 'Nowoczesny', as: NuxtLink, to: '/produkty?architecturalStyle=nowoczesny' },
        { label: 'Klasyczny', as: NuxtLink, to: '/produkty?architecturalStyle=klasyczny' },
        { label: 'Skandynawski', as: NuxtLink, to: '/produkty?architecturalStyle=skandynawski' }
      ]
    ]
  },
  {
    label: 'Garaż',
    items: [
      [
        { label: 'Z garażem jednostanowiskowym', as: NuxtLink, to: '/produkty?garage=jednostanowiskowy' },
        { label: 'Z garażem dwustanowiskowym', as: NuxtLink, to: '/produkty?garage=dwustanowiskowy' },
        { label: 'Bez garażu', as: NuxtLink, to: '/produkty?garage=brak' }
      ]
    ]
  },
  {
    label: 'Standard',
    items: [
      [
        { label: 'Energooszczędne', as: NuxtLink, to: '/produkty?energyStandard=energooszcz%C4%99dny' },
        { label: 'Pasywne', as: NuxtLink, to: '/produkty?energyStandard=pasywny' },
        { label: 'Standard', as: NuxtLink, to: '/produkty?energyStandard=standard' }
      ]
    ]
  },
  {
    label: 'Typ domu',
    items: [
      [
        { label: 'Jednorodzinny', as: NuxtLink, to: '/produkty?houseType=jednorodzinny' },
        { label: 'Bliźniak', as: NuxtLink, to: '/produkty?houseType=bli%C5%BAniak' },
        { label: 'Rekreacyjny', as: NuxtLink, to: '/produkty?houseType=rekreacyjny' }
      ]
    ]
  }
]
</script>
