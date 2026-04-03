import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { HOUSE_PLAN_MODULE } from "../../../../../modules/house_plan"
import HousePlanModuleService from "../../../../../modules/house_plan/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { id: vendorId } = req.params
  const housePlanService: HousePlanModuleService =
    req.scope.resolve(HOUSE_PLAN_MODULE)

  const families = await housePlanService.listPlanFamilies({ vendor_id: vendorId })

  res.json({ plan_families: families })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { id: vendorId } = req.params
  const { name } = req.body as { name: string }
  const housePlanService: HousePlanModuleService =
    req.scope.resolve(HOUSE_PLAN_MODULE)

  const family = await housePlanService.createPlanFamilies({
    name,
    vendor_id: vendorId,
  })

  res.status(201).json({ plan_family: family })
}
