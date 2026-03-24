import { MedusaService } from "@medusajs/framework/utils"
import HousePlan from "./models/house_plan"

class HousePlanModuleService extends MedusaService({
  HousePlan,
}) {}

export default HousePlanModuleService
