import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { HOUSE_PLAN_FIELDS } from "../../../../../modules/house_plan/fields"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  // Step 1: get house plan IDs linked to this vendor
  const { data: vendors } = await query.graph({
    entity: "vendor",
    fields: ["id", "house_plans.id"],
    filters: { id },
  })

  const housePlanIds = (vendors[0]?.house_plans ?? []).map((hp: any) => hp.id)

  if (!housePlanIds.length) {
    return res.json({ house_plans: [] })
  }

  // Step 2: query house plans directly to traverse house_plan → product link
  const { data: housePlans } = await query.graph({
    entity: "house_plan",
    fields: [
      ...HOUSE_PLAN_FIELDS,
      "product.id",
    ],
    filters: { id: housePlanIds },
  })

  res.json({ house_plans: housePlans })
}
