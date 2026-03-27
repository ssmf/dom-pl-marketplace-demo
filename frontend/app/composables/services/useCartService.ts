import { useMedusaClient, useCookie, useState } from '#imports'

export function useCartService() {
  const sdk = useMedusaClient()
  const cartIdCookie = useCookie('cart_id', { maxAge: 60 * 60 * 24 * 30 }) // 30 days
  const cart = useState('cart', () => null as any)

  async function getCart() {
    if (cart.value) return cart.value

    if (cartIdCookie.value) {
      try {
        const response = await sdk.store.cart.retrieve(cartIdCookie.value, {
            fields: '*items,*items.variant,*items.variant.product,*items.variant.product.house_plan'
        })
        cart.value = response.cart
        return cart.value
      } catch (e) {
        console.error('Failed to retrieve cart:', e)
        // Cart might be invalid/deleted
        cartIdCookie.value = null
      }
    }

    // Create new cart
    const regionsRes = await sdk.store.region.list()
    // Prefer PLN region if available
    const plnRegion = regionsRes.regions.find(r => r.currency_code === 'pln')
    const regionId = plnRegion?.id || regionsRes.regions[0]?.id

    if (!regionId) throw new Error("No region found")

    const { cart: newCart } = await sdk.store.cart.create({
      region_id: regionId
    })
    
    cartIdCookie.value = newCart.id
    cart.value = newCart
    return newCart
  }

  async function addToCart(variantId: string, quantity = 1) {
    const currentCart = await getCart()
    const { cart: updatedCart } = await sdk.store.cart.createLineItem(currentCart.id, {
      variant_id: variantId,
      quantity
    })
    cart.value = updatedCart
    return updatedCart
  }
  
  async function removeFromCart(lineItemId: string) {
    const currentCart = await getCart()
    const { cart: updatedCart } = await sdk.store.cart.deleteLineItem(currentCart.id, lineItemId)
    cart.value = updatedCart
    return updatedCart
  }

  async function completeDummyCheckout() {
    const currentCart = await getCart()
    if (!currentCart || !currentCart.items?.length) return
    
    // 1. Set email and dummy address
    await sdk.store.cart.update(currentCart.id, {
      email: "test@example.com",
      shipping_address: {
        first_name: "Test",
        last_name: "User",
        address_1: "Test Street 1",
        city: "Test City",
        country_code: "pl",
        postal_code: "00-000"
      }
    })

    // 2. Fetch shipping options and add the first one
    const { shipping_options } = await sdk.store.fulfillment.listCartOptions({ cart_id: currentCart.id })
    if (shipping_options?.length) {
      await sdk.store.cart.addShippingMethod(currentCart.id, {
        option_id: shipping_options[0].id
      })
    }

    // 3. Initiate payment session
    await sdk.store.payment.initiatePaymentSession(currentCart, {
      provider_id: 'pp_system_default' // The default manual provider in Medusa v2
    })

    // 4. Complete cart
    const { type, order } = await sdk.store.cart.complete(currentCart.id)
    
    // 5. Clear cart
    cartIdCookie.value = null
    cart.value = null

    return order
  }

  return {
    cart,
    getCart,
    addToCart,
    removeFromCart,
    completeDummyCheckout
  }
}
