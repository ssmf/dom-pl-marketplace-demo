<template>
  <div>
    <!-- Hero -->
    <div class="bg-elevated border-b border-muted">
      <UContainer class="py-16 text-center">
        <h1 class="text-4xl font-bold text-default mb-4">
          Znajdź projekt domu dla siebie
        </h1>
        <p class="text-lg text-muted mb-8 max-w-xl mx-auto">
          Przeglądaj projekty domów dopasowane do Twoich potrzeb i działki
        </p>
        <UButton
          size="lg"
          to="/produkty"
        >
          Wszystkie projekty
        </UButton>
      </UContainer>
    </div>

    <UContainer class="py-12 space-y-12">
      <!-- Według kondygnacji -->
      <FilterTileGroup
        label="Projekty według kondygnacji"
        icon="i-lucide-layers"
        :tiles="[
          { label: 'Projekty domów parterowych', icon: 'i-lucide-minus', to: '/produkty?floors=1' },
          { label: 'Projekty domów piętrowych', icon: 'i-lucide-layers', to: '/produkty?floors=2' }
        ]"
      />

      <!-- Według powierzchni -->
      <FilterTileGroup
        label="Projekty według powierzchni"
        icon="i-lucide-square"
        :tiles="[
          { label: 'Projekty małych domów do 80 m²', icon: 'i-lucide-minimize-2', to: '/produkty?maxArea=80' },
          { label: 'Projekty domów do 100 m²', icon: 'i-lucide-square', to: '/produkty?maxArea=100' },
          { label: 'Projekty domów do 120 m²', icon: 'i-lucide-square', to: '/produkty?maxArea=120' },
          { label: 'Projekty domów powyżej 150 m²', icon: 'i-lucide-maximize-2', to: '/produkty?minArea=150' }
        ]"
      />

      <!-- Popularne kategorie -->
      <FilterTileGroup
        label="Popularne kategorie"
        icon="i-lucide-home"
        :tiles="[
          { label: 'Projekty domów nowoczesnych', icon: 'i-lucide-box', to: '/produkty?architecturalStyle=nowoczesny' },
          { label: 'Projekty domów z garażem', icon: 'i-lucide-car', to: '/produkty?garage=jednostanowiskowy' },
          { label: 'Projekty domów energooszczędnych', icon: 'i-lucide-leaf', to: '/produkty?energyStandard=energooszcz%C4%99dny' },
          { label: 'Projekty domów pasywnych', icon: 'i-lucide-sun', to: '/produkty?energyStandard=pasywny' },
          { label: 'Projekty domów rekreacyjnych', icon: 'i-lucide-tree-pine', to: '/produkty?houseType=rekreacyjny' }
        ]"
      />

      <!-- Według stylu -->
      <FilterTileGroup
        label="Projekty według stylu"
        icon="i-lucide-pencil-ruler"
        :tiles="[
          { label: 'Projekty domów tradycyjnych', icon: 'i-lucide-landmark', to: '/produkty?architecturalStyle=tradycyjny' },
          { label: 'Projekty domów klasycznych', icon: 'i-lucide-columns-2', to: '/produkty?architecturalStyle=klasyczny' }
        ]"
      />
    </UContainer>
  </div>
</template>
