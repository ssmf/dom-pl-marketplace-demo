import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { ICustomerModuleService } from "@medusajs/framework/types"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const customerService: ICustomerModuleService = req.scope.resolve(Modules.CUSTOMER)

  const customer = await customerService.retrieveCustomer(id)

  res.json({ customer })
}
