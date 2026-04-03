<template>
  <div class="min-h-screen flex flex-col bg-default">
    <AppNavbar class="shrink-0" />
    <AppCategoriesNav class="shrink-0" />
    <main class="flex-1 flex flex-col">
      <slot />
    </main>
  </div>
</template>
