import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  // Step 1: product → house_plan
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["house_plan.id"],
    filters: { id },
  })

  const housePlanId = (products[0]?.house_plan as any)?.id
  if (!housePlanId) {
    return res.json({ vendor: null })
  }

  // Step 2: house_plan → vendor
  const { data: housePlans } = await query.graph({
    entity: "house_plan",
    fields: [
      "vendor.id",
      "vendor.company_name",
      "vendor.first_name",
      "vendor.last_name",
      "vendor.email",
      "vendor.average_rating",
      "vendor.house_plans.id",
    ],
    filters: { id: housePlanId },
  })

  const vendorRaw = (housePlans[0] as any)?.vendor
  if (!vendorRaw) {
    return res.json({ vendor: null })
  }

  const vendor = {
    id: vendorRaw.id,
    company_name: vendorRaw.company_name,
    first_name: vendorRaw.first_name,
    last_name: vendorRaw.last_name,
    email: vendorRaw.email,
    average_rating: vendorRaw.average_rating,
    house_plans_count: vendorRaw.house_plans?.length ?? 0,
  }

  res.json({ vendor })
}
