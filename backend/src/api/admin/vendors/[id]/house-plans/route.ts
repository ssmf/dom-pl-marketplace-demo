import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

<<<<<<< HEAD
  // Step 1: get house plan IDs linked to this vendor
  const { data: vendors } = await query.graph({
    entity: "vendor",
    fields: ["id", "house_plans.id"],
    filters: { id },
  })

  const housePlanIds = (vendors[0]?.house_plans ?? []).map((hp: any) => hp.id)

  if (!housePlanIds.length) {
    return res.json({ house_plans: [] })
  }

  // Step 2: query house plans directly to traverse house_plan → product link
  const { data: housePlans } = await query.graph({
    entity: "house_plan",
    fields: [
      "id",
      "title",
      "price",
      "img",
      "house_area",
      "boiler_room_area",
      "rooms",
      "bathrooms_and_wc",
      "plot_dimensions",
      "product.id",
    ],
    filters: { id: housePlanIds },
  })

  res.json({ house_plans: housePlans })
=======
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
<<<<<<< HEAD
>>>>>>> f2dc393 (create vendors details in admin panel)
=======
>>>>>>> f2dc3937df0d9bf6da12cee8b26bdde84e0ebc63
>>>>>>> f7b495bce5480a3af457d9fd5d62c136281b0565
}
