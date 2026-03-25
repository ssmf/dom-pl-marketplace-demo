import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { VENDOR_MODULE } from "../../../modules/vendor"
import VendorModuleService from "../../../modules/vendor/service"
import { CreateVendorSchema } from "./validators"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const vendorService: VendorModuleService = req.scope.resolve(VENDOR_MODULE)

  const limit = Number(req.query.limit ?? 20)
  const offset = Number(req.query.offset ?? 0)

  const [vendors, count] = await vendorService.listAndCountVendors({}, {
    skip: offset,
    take: limit,
  })

  res.json({ vendors, count, limit, offset })
}

export async function POST(
  req: MedusaRequest<CreateVendorSchema>,
  res: MedusaResponse
) {
  const vendorService: VendorModuleService = req.scope.resolve(VENDOR_MODULE)

  const vendor = await vendorService.createVendors(req.validatedBody)

  res.status(201).json({ vendor })
}
