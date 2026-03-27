import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { deleteProductsWorkflow } from "@medusajs/medusa/core-flows"
import { HOUSE_PLAN_MODULE } from "../../../../../../modules/house_plan"
import { VENDOR_MODULE } from "../../../../../../modules/vendor"
import HousePlanModuleService from "../../../../../../modules/house_plan/service"

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const { id: vendorId, planId } = req.params
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const link = req.scope.resolve(ContainerRegistrationKeys.LINK)
  const housePlanService: HousePlanModuleService = req.scope.resolve(HOUSE_PLAN_MODULE)

  // Find the linked Medusa product via reverse traversal
  const { data: housePlans } = await query.graph({
    entity: "house_plan",
    fields: ["id", "product.id"],
    filters: { id: planId },
  })
  const productId = (housePlans[0]?.product as any)?.id

  // Dismiss vendor↔house_plan link FIRST — prevents orphaned link entries
  // that would cause the vendor house plans query to fail
  await link.dismiss({
    [VENDOR_MODULE]: { vendor_id: vendorId },
    [HOUSE_PLAN_MODULE]: { house_plan_id: planId },
  })

  // Delete house plan
  await housePlanService.deleteHousePlans(planId)

  // Delete the linked Medusa product if found (cascades variants + product↔house_plan link)
  if (productId) {
    await deleteProductsWorkflow(req.scope).run({
      input: { ids: [productId] },
    })
  }

  res.json({ id: planId, deleted: true })
}
