import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { ICustomerModuleService } from "@medusajs/framework/types"

export default async function seedCustomers({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const customerService: ICustomerModuleService = container.resolve(Modules.CUSTOMER)

  logger.info("Seeding customers...")

  const existing = await customerService.listCustomers()
  if (existing.length) {
    logger.info(`Customers already exist (${existing.length}), skipping.`)
    return
  }

  await customerService.createCustomers([
    {
      first_name: "Anna",
      last_name: "Kowalska",
      email: "anna.kowalska@example.com",
      phone: "+48 600 100 200",
      has_account: true,
    },
    {
      first_name: "Piotr",
      last_name: "Wiśniewski",
      email: "piotr.wisniewski@example.com",
      phone: "+48 601 200 300",
      has_account: true,
    },
  ])

  logger.info("Customers seeded successfully.")
}
