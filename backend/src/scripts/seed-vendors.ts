import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { VENDOR_MODULE } from "../modules/vendor"
import VendorModuleService from "../modules/vendor/service"

export default async function seedVendors({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const vendorService: VendorModuleService = container.resolve(VENDOR_MODULE)

  logger.info("Seeding vendors...")

  const existing = await vendorService.listVendors()
  if (existing.length) {
    logger.info(`Vendors already exist (${existing.length}), skipping.`)
    return
  }

  await vendorService.createVendors([
    {
      company_name: "Projekty Domów Kowalski",
      first_name: "Jan",
      last_name: "Kowalski",
      email: "jan.kowalski@example.com",
      published_plans_count: 12,
      revenue: 23400,
      average_rating: 4.8,
    },
    {
      company_name: "Projekty Malinowski",
      first_name: "Marek",
      last_name: "Malinowski",
      email: "biuro@malinowski-projekty.pl",
      published_plans_count: 7,
      revenue: 11200,
      average_rating: 4.5,
    },
  ])

  logger.info("Vendors seeded successfully.")
}
