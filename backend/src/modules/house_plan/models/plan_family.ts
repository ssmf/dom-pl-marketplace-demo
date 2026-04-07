import { model } from "@medusajs/framework/utils"
import HousePlan from "./house_plan"

const PlanFamily = model.define("plan_family", {
  id: model.id().primaryKey(),
  name: model.text(),
  vendor_id: model.text(),
  house_plans: model.hasMany(() => HousePlan, {
    mappedBy: "family",
  }),
}).indexes([
  { on: ["vendor_id", "name"], unique: true },
])

export default PlanFamily