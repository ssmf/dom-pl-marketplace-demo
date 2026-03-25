import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { VENDOR_MODULE } from "../../../../modules/vendor"
import VendorModuleService from "../../../../modules/vendor/service"
import { UpdateVendorSchema } from "../validators"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const vendorService: VendorModuleService = req.scope.resolve(VENDOR_MODULE)

  const vendor = await vendorService.retrieveVendor(id)

  if (!vendor) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, `Vendor with id ${id} not found`)
  }

  res.json({ vendor })
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
