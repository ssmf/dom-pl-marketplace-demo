import house_plan from "../modules/house_plan"
import ProductModule from "@medusajs/medusa/product"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
  ProductModule.linkable.product,
  house_plan.linkable.housePlan
)