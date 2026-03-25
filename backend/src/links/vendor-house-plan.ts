import { defineLink } from "@medusajs/framework/utils"
import VendorModule from "../modules/vendor"
import HousePlanModule from "../modules/house_plan"

export default defineLink(
  {
    linkable: VendorModule.linkable.vendor,
    isList: true,
  },
  HousePlanModule.linkable.housePlan
)
