import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"
import { VENDOR_GRAPH_FIELDS, toVendorWithCount } from "../../../shared/vendor"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data } = await query.graph({
    entity: "vendor",
    fields: [...VENDOR_GRAPH_FIELDS],
    filters: { id },
  })

  if (!data[0]) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, `Vendor with id ${id} not found`)
  }

  res.json({ vendor: toVendorWithCount(data[0]) })
}
