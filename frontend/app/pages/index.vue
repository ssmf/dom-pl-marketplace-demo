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
          { label: 'Projekty domów parterowych', icon: 'i-lucide-minus' },
          { label: 'Projekty domów piętrowych', icon: 'i-lucide-layers' },
          { label: 'Projekty z poddaszem użytkowym', icon: 'i-lucide-triangle' }
        ]"
      />

      <!-- Według powierzchni -->
      <FilterTileGroup
        label="Projekty według powierzchni"
        icon="i-lucide-square"
        :tiles="[
          { label: 'Projekty małych domów do 80 m²', icon: 'i-lucide-minimize-2' },
          { label: 'Projekty domów do 100 m²', icon: 'i-lucide-square' },
          { label: 'Projekty domów do 120 m²', icon: 'i-lucide-square' },
          { label: 'Projekty domów powyżej 150 m²', icon: 'i-lucide-maximize-2' }
        ]"
      />

      <!-- Popularne kategorie -->
      <FilterTileGroup
        label="Popularne kategorie"
        icon="i-lucide-home"
        :tiles="[
          { label: 'Projekty domów tanich w budowie', icon: 'i-lucide-piggy-bank' },
          { label: 'Projekty domów nowoczesnych', icon: 'i-lucide-box' },
          { label: 'Projekty domów z garażem', icon: 'i-lucide-car' },
          { label: 'Projekty domów energooszczędnych', icon: 'i-lucide-leaf' },
          { label: 'Projekty domów pasywnych', icon: 'i-lucide-sun' },
          { label: 'Projekty domów rekreacyjnych', icon: 'i-lucide-tree-pine' }
        ]"
      />

      <!-- Według stylu -->
      <FilterTileGroup
        label="Projekty według stylu"
        icon="i-lucide-pencil-ruler"
        :tiles="[
          { label: 'Projekty domów tradycyjnych', icon: 'i-lucide-landmark' },
          { label: 'Projekty domów klasycznych', icon: 'i-lucide-columns-2' }
        ]"
      />
    </UContainer>
  </div>
</template>
