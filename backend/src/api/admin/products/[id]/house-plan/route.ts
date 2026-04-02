import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { HOUSE_PLAN_MODULE } from "../../../../../modules/house_plan"
import HousePlanModuleService from "../../../../../modules/house_plan/service"
import { HOUSE_PLAN_FIELDS } from "../../../../../modules/house_plan/fields"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: products } = await query.graph({
    entity: "product",
    fields: HOUSE_PLAN_FIELDS.map((f) => `house_plan.${f}`),
    filters: { id },
  })

  const house_plan = products[0]?.house_plan ?? null
  res.json({ house_plan })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const housePlanService: HousePlanModuleService = req.scope.resolve(HOUSE_PLAN_MODULE)

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["house_plan.id"],
    filters: { id },
  })

  const housePlanId = (products[0]?.house_plan as any)?.id
  if (!housePlanId) {
    return res.status(404).json({ message: "Brak powiązanego planu domu" })
  }

  const house_plan = await housePlanService.updateHousePlans({
    id: housePlanId,
    ...req.body as object,
  })

  res.json({ house_plan })
}
