import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  // Get orders for this customer
  const { data: orders } = await query.graph({
    entity: "order",
    fields: [
      "id", "status", "created_at", "total", "email",
      "items.id", "items.title", "items.product_id",
      "items.unit_price", "items.quantity",
    ],
    filters: { customer_id: id },
  })

  if (!(orders as any[]).length) {
    return res.json({ orders: [] })
  }

  // Enrich item titles with house plan names where available
  const productIds = (orders as any[])
    .flatMap((o) => o.items ?? [])
    .map((item: any) => item.product_id)
    .filter(Boolean)

  const productToTitle: Record<string, string> = {}
  if (productIds.length) {
    const { data: housePlans } = await query.graph({
      entity: "house_plan",
      fields: ["id", "title", "product.id"],
    })
    for (const hp of housePlans as any[]) {
      if (hp.product?.id) productToTitle[hp.product.id] = hp.title
    }
  }

  const result = (orders as any[]).map((o) => ({
    id: o.id,
    status: o.status,
    created_at: o.created_at,
    total: o.total,
    email: o.email,
    items: (o.items ?? []).map((item: any) => ({
      id: item.id,
      title: productToTitle[item.product_id] ?? item.title,
      quantity: item.quantity,
      unit_price: item.unit_price,
    })),
  }))

  res.json({ orders: result })
}
