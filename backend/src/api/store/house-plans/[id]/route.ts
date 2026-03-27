import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: housePlans } = await query.graph({
    entity: "house_plan",
    fields: [
      "id",
      "title",
      "price",
      "description",
      "img",
      "house_area",
      "boiler_room_area",
      "rooms",
      "bathrooms_and_wc",
      "plot_dimensions",
      "min_plot_dimensions_after_adaptation",
      "vendor.id",
      "vendor.company_name",
      "vendor.first_name",
      "vendor.last_name",
      "vendor.email",
      "vendor.average_rating",
      "vendor.house_plans.id",
    ],
    filters: { id: req.params.id },
  })

  if (!housePlans[0]) {
    return res.status(404).json({ message: "Plan domu nie znaleziony" })
  }

  const housePlan = housePlans[0]
  const vendorRaw = (housePlan as any).vendor
  const vendor = vendorRaw
    ? {
        id: vendorRaw.id,
        company_name: vendorRaw.company_name,
        first_name: vendorRaw.first_name,
        last_name: vendorRaw.last_name,
        email: vendorRaw.email,
        average_rating: vendorRaw.average_rating,
        house_plans_count: vendorRaw.house_plans?.length ?? 0,
      }
    : null

  res.json({ house_plan: { ...housePlan, vendor } })
}