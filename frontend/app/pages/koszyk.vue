<script setup lang="ts">
import { useAsyncData, useRouter, ref } from '#imports'
import { useCartService } from '~/composables/services/useCartService'

const cartService = useCartService()
const router = useRouter()
const toast = useToast()
const isCheckingOut = ref(false)

const { data: cart, refresh, pending } = await useAsyncData('cart', () => cartService.getCart())

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    maximumFractionDigits: 0
  }).format(price)
}

const handleCheckout = async () => {
  isCheckingOut.value = true
  try {
    await cartService.completeDummyCheckout()
    toast.add({
      title: 'Sukces',
      description: 'Zamówienie zostało złożone pomyślnie!',
      color: 'success'
    })
    router.push('/')
  } catch (error) {
    console.error('Checkout failed:', error)
    toast.add({
      title: 'Błąd',
      description: 'Wystąpił błąd podczas składania zamówienia.',
      color: 'error'
    })
  } finally {
    isCheckingOut.value = false
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
    <h1 class="text-3xl font-bold text-default mb-8">Twój koszyk</h1>

    <div v-if="pending" class="flex justify-center py-12">
      <UIcon name="i-lucide-loader-2" class="size-8 animate-spin text-primary" />
    </div>

    <div v-else-if="!cart || !cart.items || cart.items.length === 0" class="text-center py-12 bg-[var(--ui-bg-elevated)] rounded-xl border border-[var(--ui-border)]">
      <UIcon name="i-lucide-shopping-cart" class="size-16 text-muted mb-4 mx-auto" />
      <h2 class="text-xl font-semibold text-default mb-2">Twój koszyk jest pusty</h2>
      <p class="text-muted mb-6">Przejdź do projektów, aby znaleźć coś dla siebie.</p>
      <UButton to="/produkty" size="lg" icon="i-lucide-search">
        Przeglądaj projekty
      </UButton>
    </div>

    <div v-else class="space-y-8">
      <!-- Cart Items -->
      <UCard>
        <ul class="divide-y divide-[var(--ui-border)]">
          <li v-for="item in cart.items" :key="item.id" class="py-6 flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="size-16 bg-[var(--ui-bg-elevated)] rounded-md flex items-center justify-center overflow-hidden border border-[var(--ui-border)]">
                <UIcon name="i-lucide-home" class="size-8 text-muted" />
              </div>
              <div>
                <h3 class="font-semibold text-default">{{ item.title }}</h3>
                <p class="text-sm text-muted">Ilość: {{ item.quantity }}</p>
              </div>
            </div>
            <div class="font-bold text-lg">
              {{ formatPrice(item.unit_price) }}
            </div>
          </li>
        </ul>
      </UCard>

      <!-- Cart Summary -->
      <div class="flex flex-col items-end gap-4">
        <div class="text-xl">
          <span class="text-muted mr-4">Suma częściowa:</span>
          <span class="font-bold text-2xl">{{ formatPrice(cart.subtotal || 0) }}</span>
        </div>
        
        <UButton
          size="xl"
          icon="i-lucide-check-circle"
          :loading="isCheckingOut"
          @click="handleCheckout"
        >
          Złóż zamówienie
        </UButton>
      </div>
    </div>
  </div>
</template>
