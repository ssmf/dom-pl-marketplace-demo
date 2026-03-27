import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Text, Avatar, Button } from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import type { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import { sdk } from "../lib/client"

type Vendor = {
  id: string
  company_name: string
  first_name: string
  last_name: string
  email: string
  average_rating: number | null
  house_plans_count: number
}

const ProductVendorWidget = ({ data: product }: DetailWidgetProps<AdminProduct>) => {
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ["product-vendor", product.id],
    queryFn: () =>
      sdk.client.fetch<{ vendor: Vendor | null }>(`/admin/products/${product.id}/vendor`),
  })

  const vendor = data?.vendor

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          Sprzedawca
        </Text>
      </div>

      <div className="px-6 py-4">
        {isLoading && (
          <Text size="small" leading="compact" className="text-ui-fg-subtle">
            Ładowanie...
          </Text>
        )}

        {!isLoading && !vendor && (
          <Text size="small" leading="compact" className="text-ui-fg-subtle">
            Brak przypisanego sprzedawcy
          </Text>
        )}

        {!isLoading && vendor && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-3">
              <Avatar
                size="small"
                fallback={`${vendor.first_name[0] ?? ""}${vendor.last_name[0] ?? ""}`.toUpperCase()}
              />
              <div className="flex flex-col gap-y-0.5">
                <Text size="small" leading="compact" weight="plus">
                  {vendor.company_name}
                </Text>
                <Text size="small" leading="compact" className="text-ui-fg-subtle">
                  {vendor.first_name} {vendor.last_name}
                </Text>
                <div className="flex items-center gap-x-3 mt-0.5">
                  {vendor.average_rating != null && (
                    <Text size="small" leading="compact" className="text-ui-fg-subtle">
                      ★ {vendor.average_rating.toFixed(1)}
                    </Text>
                  )}
                  <Text size="small" leading="compact" className="text-ui-fg-subtle">
                    {vendor.house_plans_count}{" "}
                    {vendor.house_plans_count === 1 ? "projekt" : "projektów"}
                  </Text>
                </div>
              </div>
            </div>

            <Button
              size="small"
              variant="secondary"
              onClick={() => navigate(`/vendors/${vendor.id}`)}
            >
              Zobacz profil
            </Button>
          </div>
        )}
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.side.before",
})

export default ProductVendorWidget
