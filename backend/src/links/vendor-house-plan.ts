import { defineLink } from "@medusajs/framework/utils"
import VendorModule from "../modules/vendor"
import HousePlanModule from "../modules/house_plan"

export default defineLink(
  VendorModule.linkable.vendor,
  {
    linkable: HousePlanModule.linkable.housePlan,
    isList: true,
  }
)
