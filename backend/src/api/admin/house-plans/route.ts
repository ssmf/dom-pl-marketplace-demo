import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { HOUSE_PLAN_MODULE } from "../../../modules/house_plan"
import HousePlanModuleService from "../../../modules/house_plan/service"
import { CreateHousePlanSchema } from "./validators"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const housePlanService: HousePlanModuleService =
    req.scope.resolve(HOUSE_PLAN_MODULE)

  const limit = Number(req.query.limit ?? 12)
  const offset = Number(req.query.offset ?? 0)
  const family_id = req.query.family_id as string | undefined

  const filters: Record<string, unknown> = {}
  if (family_id) filters.family_id = family_id

  const [plans, count] = await housePlanService.listAndCountHousePlans(filters, {
    skip: offset,
    take: limit,
    relations: ["family"],
  })

  // When filtering by family, also resolve the linked product id for each plan
  if (family_id && plans.length > 0) {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    const planIds = plans.map((p) => p.id)

    const { data: linked } = await query.graph({
      entity: "house_plan",
      fields: ["id", "product.id"],
      filters: { id: planIds },
    })

    const productIdByPlanId: Record<string, string> = {}
    for (const item of linked) {
      const productId = (item as any).product?.id
      if (productId) productIdByPlanId[item.id] = productId
    }

    const house_plans = plans.map((p) => ({
      ...p,
      product_id: productIdByPlanId[p.id] ?? null,
    }))

    return res.json({ house_plans, count, limit, offset })
  }

  res.json({ house_plans: plans, count, limit, offset })
}

export async function POST(
  req: MedusaRequest<CreateHousePlanSchema>,
  res: MedusaResponse
) {
  const housePlanService: HousePlanModuleService =
    req.scope.resolve(HOUSE_PLAN_MODULE)

  const house_plan = await housePlanService.createHousePlans(req.validatedBody)

  res.status(201).json({ house_plan })
}