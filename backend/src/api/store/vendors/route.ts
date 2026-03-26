import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { VENDOR_GRAPH_FIELDS, toVendorWithCount } from "../../shared/vendor"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const limit = Number(req.query.limit ?? 20)
  const offset = Number(req.query.offset ?? 0)

  const { data, metadata } = await query.graph({
    entity: "vendor",
    fields: [...VENDOR_GRAPH_FIELDS],
    pagination: { skip: offset, take: limit },
  })

  res.json({
    vendors: data.map(toVendorWithCount),
    count: metadata?.count ?? data.length,
    limit,
    offset,
  })
}
