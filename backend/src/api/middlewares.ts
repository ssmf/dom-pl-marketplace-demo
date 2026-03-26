import { defineMiddlewares, validateAndTransformBody } from "@medusajs/framework/http"
import { CreateHousePlanSchema, UpdateHousePlanSchema } from "./admin/house-plans/validators"
import { CreateVendorSchema, UpdateVendorSchema } from "./admin/vendors/validators"

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
    {
      matcher: "/admin/vendors",
      method: "POST",
      middlewares: [validateAndTransformBody(CreateVendorSchema)],
    },
    {
      matcher: "/admin/vendors/:id",
      method: "POST",
      middlewares: [validateAndTransformBody(UpdateVendorSchema)],
    },
  ],
})
