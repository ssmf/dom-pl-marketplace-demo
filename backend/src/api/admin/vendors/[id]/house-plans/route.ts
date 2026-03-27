import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: vendors } = await query.graph({
    entity: "vendor",
    fields: [
      "id",
      "house_plans.id",
      "house_plans.title",
      "house_plans.price",
      "house_plans.img",
      "house_plans.house_area",
      "house_plans.boiler_room_area",
      "house_plans.rooms",
      "house_plans.bathrooms_and_wc",
      "house_plans.plot_dimensions",
    ],
    filters: { id },
  })

  res.json({ house_plans: vendors[0]?.house_plans ?? [] })
}
