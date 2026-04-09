import { MedusaService } from "@medusajs/framework/utils"
import HousePlan from "./models/house_plan"
import PlanFamily from "./models/plan_family"
import HousePlanImage from "./models/house_plan_image"

class HousePlanModuleService extends MedusaService({
  HousePlan,
  PlanFamily,
  HousePlanImage,
}) {}

export default HousePlanModuleService
