import { defineMiddlewares, validateAndTransformBody } from "@medusajs/framework/http"
import { CreateHousePlanSchema, UpdateHousePlanSchema } from "./admin/house-plans/validators"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/house-plans",
      method: "POST",
      middlewares: [validateAndTransformBody(CreateHousePlanSchema)],
    },
    {
      matcher: "/admin/house-plans/:id",
      method: "POST",
      middlewares: [validateAndTransformBody(UpdateHousePlanSchema)],
    },
  ],
})
