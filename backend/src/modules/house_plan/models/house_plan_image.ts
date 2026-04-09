import { model } from "@medusajs/framework/utils"
import HousePlan from "./house_plan"

const HousePlanImage = model.define("house_plan_image", {
  id: model.id().primaryKey(),
  url: model.text(),
  type: model.text().default("cover"), // "cover" | "gallery" | "floor_plan" | "featured"
  position: model.number().default(0),
  alt: model.text().nullable(),
  house_plan: model.belongsTo(() => HousePlan, {
    mappedBy: "images",
  }),
})

export default HousePlanImage
