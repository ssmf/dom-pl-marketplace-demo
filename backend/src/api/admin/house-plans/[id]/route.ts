import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { HOUSE_PLAN_MODULE } from "../../../../modules/house_plan"
import HousePlanModuleService from "../../../../modules/house_plan/service"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const housePlanService: HousePlanModuleService =
    req.scope.resolve(HOUSE_PLAN_MODULE)

  const house_plan = await housePlanService.updateHousePlans({
    id,
    ...(req.body as object),
  })

  res.json({ house_plan })
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const housePlanService: HousePlanModuleService =
    req.scope.resolve(HOUSE_PLAN_MODULE)

  await housePlanService.deleteHousePlans(id)

  res.json({ id, deleted: true })
}
