import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"
import { VENDOR_MODULE } from "../../../../modules/vendor"
import VendorModuleService from "../../../../modules/vendor/service"
import { UpdateVendorSchema } from "../validators"
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

export async function POST(
  req: MedusaRequest<UpdateVendorSchema>,
  res: MedusaResponse
) {
  const { id } = req.params
  const vendorService: VendorModuleService = req.scope.resolve(VENDOR_MODULE)
  const vendor = await vendorService.updateVendors({ id, ...req.validatedBody })
  res.json({ vendor })
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const vendorService: VendorModuleService = req.scope.resolve(VENDOR_MODULE)
  await vendorService.deleteVendors(id)
  res.json({ id, deleted: true })
}
