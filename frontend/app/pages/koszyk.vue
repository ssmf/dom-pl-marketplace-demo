<script setup lang="ts">
import { useAsyncData, useRouter, ref } from '#imports'
import { useCartService } from '~/composables/services/useCartService'

const cartService = useCartService()
const router = useRouter()
const toast = useToast()
const isCheckingOut = ref(false)
const removingItemId = ref<string | null>(null)

const { data: cart, refresh, pending } = await useAsyncData('cart', () => cartService.getCart())

const handleRemove = async (lineItemId: string) => {
  removingItemId.value = lineItemId
  try {
    await cartService.removeFromCart(lineItemId)
    await refresh()
  } catch {
    toast.add({ title: 'Błąd', description: 'Nie udało się usunąć produktu.', color: 'error' })
  } finally {
    removingItemId.value = null
  }
}

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
            <NuxtLink
              :to="item.variant?.product?.house_plan?.id ? `/produkty/${item.variant.product.house_plan.id}` : undefined"
              class="flex items-center gap-4 group"
              :class="{ 'cursor-pointer': item.variant?.product?.house_plan?.id }"
            >
              <div class="size-16 bg-[var(--ui-bg-elevated)] rounded-md flex items-center justify-center overflow-hidden border border-[var(--ui-border)]">
                <NuxtImg
                  v-if="item.variant?.product?.thumbnail"
                  :src="item.variant.product.thumbnail"
                  class="w-full h-full object-cover"
                  alt="Miniatura projektu"
                />
                <UIcon v-else name="i-lucide-home" class="size-8 text-muted" />
              </div>
              <div>
                <h3 class="font-semibold text-default group-hover:text-primary transition-colors">{{ item.title }}</h3>
                <p class="text-sm text-muted">Ilość: {{ item.quantity }}</p>
              </div>
            </NuxtLink>
            <div class="flex items-center gap-4">
              <span class="font-bold text-lg">{{ formatPrice(item.unit_price) }}</span>
              <UButton
                color="error"
                variant="ghost"
                icon="i-lucide-trash-2"
                size="sm"
                class="cursor-pointer"
                :loading="removingItemId === item.id"
                :disabled="removingItemId !== null"
                @click="handleRemove(item.id)"
              />
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
          class="cursor-pointer"
          @click="handleCheckout"
        >
          Złóż zamówienie
        </UButton>
      </div>
    </div>
  </div>
</template>
