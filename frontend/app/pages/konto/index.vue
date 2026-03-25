<template>
  <UContainer class="flex flex-1 items-center justify-center py-16">
    <div class="w-full max-w-2xl space-y-10">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-default">
          Wybierz konto
        </h1>
        <p class="mt-2 text-muted">
          Wersja demo — wybierz konto, które chcesz podejrzeć
        </p>
      </div>

      <!-- Klienci -->
      <div class="space-y-3">
        <div class="flex items-center gap-2">
          <UIcon
            name="i-lucide-user"
            class="size-5 text-muted"
          />
          <h2 class="text-sm font-semibold uppercase tracking-wide text-muted">
            Klienci
          </h2>
        </div>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <UCard
            v-for="account in customers"
            :key="account.email"
            class="cursor-pointer transition-shadow hover:shadow-md"
            as="a"
            :href="account.href"
          >
            <div class="flex items-center gap-4">
              <UAvatar
                :alt="account.name"
                :icon="account.icon"
                size="md"
              />
              <div class="min-w-0">
                <p class="truncate font-medium text-default">
                  {{ account.name }}
                </p>
                <p class="truncate text-sm text-muted">
                  {{ account.email }}
                </p>
              </div>
              <UIcon
                name="i-lucide-arrow-right"
                class="ml-auto size-4 shrink-0 text-muted"
              />
            </div>
          </UCard>
        </div>
      </div>

      <!-- Sprzedawcy -->
      <div class="space-y-3 mt-10">
        <div class="flex items-center gap-2">
          <UIcon
            name="i-lucide-store"
            class="size-5 text-muted"
          />
          <h2 class="text-sm font-semibold uppercase tracking-wide text-muted">
            Sprzedawcy
          </h2>
        </div>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <UCard
            v-for="account in vendors"
            :key="account.email"
            class="cursor-pointer transition-shadow hover:shadow-md"
            as="a"
            :href="account.href"
          >
            <div class="flex items-center gap-4">
              <UAvatar
                :alt="account.name"
                :icon="account.icon"
                size="md"
              />
              <div class="min-w-0">
                <p class="truncate font-medium text-default">
                  {{ account.name }}
                </p>
                <p class="truncate text-sm text-muted">
                  {{ account.email }}
                </p>
              </div>
              <UIcon
                name="i-lucide-arrow-right"
                class="ml-auto size-4 shrink-0 text-muted"
              />
            </div>
          </UCard>
        </div>
      </div>

      <p class="text-center text-xs text-muted mt-10">
        <UIcon
          name="i-lucide-info"
          class="mr-1 inline size-3"
        />
        Widok demo — bez logowania
      </p>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const customers = [
  {
    name: 'Anna Kowalska',
    email: 'anna.kowalska@example.com',
    icon: 'i-lucide-user',
    href: '/konto/klient'
  },
  {
    name: 'Piotr Wiśniewski',
    email: 'piotr.wisniewski@example.com',
    icon: 'i-lucide-user',
    href: '/konto/klient'
  }
]

const vendors = [
  {
    name: 'Jan Kowalski',
    email: 'jan.kowalski@example.com',
    icon: 'i-lucide-store',
    href: '/konto/sprzedawca'
  },
  {
    name: 'Projekty Malinowski',
    email: 'biuro@malinowski-projekty.pl',
    icon: 'i-lucide-store',
    href: '/konto/sprzedawca'
  }
]
</script>
