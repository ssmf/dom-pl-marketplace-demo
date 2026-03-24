import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { HOUSE_PLAN_MODULE } from "../../modules/house_plan"
import HousePlanModuleService from "../../modules/house_plan/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const housePlanService: HousePlanModuleService =
    req.scope.resolve(HOUSE_PLAN_MODULE)

  const { limit = 12, offset = 0, ...filters } = req.query as any

  const [house_plans, count] = await housePlanService.listAndCountHousePlans(filters, {
    skip: Number(offset),
    take: Number(limit),
  })

  res.json({
    house_plans,
    count,
    limit: Number(limit),
    offset: Number(offset),
  })
}