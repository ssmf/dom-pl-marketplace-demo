import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  // Step 1: get product IDs for this vendor's house plans
  const { data: vendors } = await query.graph({
    entity: "vendor",
    fields: ["id", "house_plans.id", "house_plans.title", "house_plans.product.id"],
    filters: { id },
  })

  const housePlans: any[] = vendors[0]?.house_plans ?? []

  const productIds = housePlans.map((hp) => hp.product?.id).filter(Boolean) as string[]

  if (!productIds.length) {
    return res.json({ orders: [] })
  }

  const productToPlan: Record<string, string> = {}
  for (const hp of housePlans) {
    if (hp.product?.id) productToPlan[hp.product.id] = hp.title
  }

  // Step 2: get all orders with items via query.graph
  const { data: allOrders } = await query.graph({
    entity: "order",
    fields: [
      "id", "status", "created_at", "total", "email",
      "items.id", "items.title", "items.product_id",
      "items.unit_price", "items.quantity",
    ],
  })

  // Step 3: filter to only orders containing this vendor's products
  const vendorOrders = (allOrders as any[])
    .filter((o) =>
      (o.items ?? []).some((item: any) => productIds.includes(item.product_id))
    )
    .map((o) => ({
      id: o.id,
      status: o.status,
      created_at: o.created_at,
      total: o.total,
      email: o.email,
      items: (o.items ?? [])
        .filter((item: any) => productIds.includes(item.product_id))
        .map((item: any) => ({
          id: item.id,
          title: productToPlan[item.product_id] ?? item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
    }))

  res.json({ orders: vendorOrders })
}
