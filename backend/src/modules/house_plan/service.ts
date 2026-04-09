import { MedusaService } from "@medusajs/framework/utils"
import HousePlan from "./models/house_plan"
import PlanFamily from "./models/plan_family"

class HousePlanModuleService extends MedusaService({
  HousePlan,
  PlanFamily,
}) {}

export default HousePlanModuleService
