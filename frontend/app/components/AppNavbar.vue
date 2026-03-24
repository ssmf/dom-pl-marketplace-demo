<script setup lang="ts">
const searchQuery = ref('')
const isSearchOpen = ref(false)
</script>

<template>
  <header class="border-b border-default bg-default sticky top-0 z-50">
    <UContainer>
      <nav class="flex items-center gap-4 h-16">
        <NuxtLink to="/" class="shrink-0 text-default hover:text-primary transition-colors">
          <AppLogo class="h-7 w-auto" />
        </NuxtLink>

        <div class="flex-1" />

        <div class="hidden sm:flex items-center">
          <UInput
            v-model="searchQuery"
            placeholder="Szukaj produktów..."
            icon="i-lucide-search"
            size="sm"
            class="w-56 lg:w-72"
            @keyup.enter="isSearchOpen = false"
          />
        </div>

        <UButton
          icon="i-lucide-search"
          variant="ghost"
          color="neutral"
          size="sm"
          class="sm:hidden"
          aria-label="Szukaj"
        />

        <UButton
          to="/konto"
          icon="i-lucide-circle-user"
          variant="ghost"
          color="neutral"
          size="sm"
          aria-label="Konto"
        />

        <UButton
          to="/koszyk"
          icon="i-lucide-shopping-bag"
          variant="ghost"
          color="neutral"
          size="sm"
          aria-label="Koszyk"
        />
      </nav>
    </UContainer>
  </header>
</template>
