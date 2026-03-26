import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge } from "@medusajs/ui"
import type { DetailWidgetProps, AdminCustomer } from "@medusajs/framework/types"

/**
 * Demo stats per customer.
 * TODO: Replace with real data — orders from /admin/orders?customer_id=X,
 * saved plans via Customer ↔ HousePlan module link.
 */
const DEMO_STATS: Record<string, {
  orders_count: number
  saved_plans: number
  total_spent: number
  reviews_count: number
}> = {
  "anna.kowalska@example.com":    { orders_count: 5,  saved_plans: 12, total_spent: 3150, reviews_count: 3 },
  "piotr.wisniewski@example.com": { orders_count: 3,  saved_plans: 7,  total_spent: 1870, reviews_count: 1 },
}

const FALLBACK = [
  { orders_count: 2, saved_plans: 5,  total_spent: 980,  reviews_count: 0 },
  { orders_count: 4, saved_plans: 2,  total_spent: 2200, reviews_count: 2 },
  { orders_count: 1, saved_plans: 9,  total_spent: 340,  reviews_count: 1 },
  { orders_count: 6, saved_plans: 3,  total_spent: 4100, reviews_count: 3 },
  { orders_count: 3, saved_plans: 7,  total_spent: 1560, reviews_count: 0 },
]

const formatPLN = (value: number) =>
  value.toLocaleString("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  })

const CustomerStatsWidget = ({ data: customer }: DetailWidgetProps<AdminCustomer>) => {
  const stats =
    DEMO_STATS[customer.email] ??
    FALLBACK[customer.id.charCodeAt(customer.id.length - 1) % FALLBACK.length]

  const tiles = [
    { label: "Zamówienia",      value: String(stats.orders_count) },
    { label: "Zapisane plany",  value: String(stats.saved_plans) },
    { label: "Wydane łącznie",  value: formatPLN(stats.total_spent) },
    { label: "Opinie",          value: String(stats.reviews_count) },
  ]

  return (
    <Container className="px-6 py-4 divide-y divide-ui-border-base">
      <div className="flex items-center justify-between pb-4">
        <Heading level="h2">Statystyki klienta</Heading>
        <Badge size="2xsmall" color="grey">Demo</Badge>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-4 sm:grid-cols-4">
        {tiles.map((tile) => (
          <div key={tile.label} className="flex flex-col gap-y-1">
            <Text size="small" leading="compact" className="text-ui-fg-subtle">
              {tile.label}
            </Text>
            <Text size="small" leading="compact" weight="plus">
              {tile.value}
            </Text>
          </div>
        ))}
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "customer.details.after",
})

export default CustomerStatsWidget
