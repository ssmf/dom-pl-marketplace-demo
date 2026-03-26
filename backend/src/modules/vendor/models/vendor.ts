import { model } from "@medusajs/framework/utils"

const Vendor = model.define("vendor", {
  id: model.id().primaryKey(),
  company_name: model.text(),
  first_name: model.text(),
  last_name: model.text(),
  email: model.text(),
  published_plans_count: model.number().default(0),
  revenue: model.bigNumber().default(0),
  average_rating: model.number().nullable(),
})

export default Vendor
