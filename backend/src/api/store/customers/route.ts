import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { ICustomerModuleService } from "@medusajs/framework/types"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const customerService: ICustomerModuleService = req.scope.resolve(Modules.CUSTOMER)

  const limit = Number(req.query.limit ?? 20)
  const offset = Number(req.query.offset ?? 0)

  const [customers, count] = await customerService.listAndCountCustomers(
    {},
    { skip: offset, take: limit }
  )

  res.json({ customers, count, limit, offset })
}
