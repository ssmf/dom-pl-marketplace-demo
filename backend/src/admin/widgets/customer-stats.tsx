import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge } from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import type { DetailWidgetProps, AdminCustomer } from "@medusajs/framework/types"
import { sdk } from "../lib/client"

const formatPLN = (value: number) =>
  value.toLocaleString("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  })

const CustomerStatsWidget = ({ data: customer }: DetailWidgetProps<AdminCustomer>) => {
  const { data, isLoading } = useQuery({
    queryKey: ["customer-orders", customer.id],
    queryFn: () =>
      sdk.admin.order.list({ customer_id: customer.id, limit: 500 } as any),
  })

  const orders = (data as any)?.orders ?? []
  const ordersCount = orders.length
  const totalSpent = orders.reduce((sum: number, o: any) => sum + (o.total ?? 0), 0)

  const tiles = [
    { label: "Zamówienia", value: isLoading ? "…" : String(ordersCount) },
    { label: "Wydane łącznie", value: isLoading ? "…" : formatPLN(totalSpent) },
  ]

  return (
    <Container className="px-6 py-4 divide-y divide-ui-border-base">
      <div className="flex items-center justify-between pb-4">
        <Heading level="h2">Statystyki klienta</Heading>
        <Badge size="2xsmall" color="grey">Live</Badge>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-4">
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
