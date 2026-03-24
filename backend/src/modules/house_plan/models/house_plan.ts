import { model } from "@medusajs/framework/utils"

const HousePlan = model.define("house_plan", {
  id: model.id().primaryKey(),
  title: model.text(),
  price: model.bigNumber(),
  description: model.text().nullable(),
  img: model.text().nullable(),
  house_area: model.number(),
  boiler_room_area: model.number().nullable(),
  rooms: model.number(),
  bathrooms_and_wc: model.number(),
  plot_dimensions: model.text(),
  min_plot_dimensions_after_adaptation: model.text().nullable(),
})

export default HousePlan
