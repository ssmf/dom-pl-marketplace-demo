import { createProductsWorkflow } from "@medusajs/medusa/core-flows"
import { createHousePlanFromProductWorkflow } from "../house_plan/create-house-plan-from-product"

createProductsWorkflow.hooks.productsCreated(
  async ({ products, additional_data }, { container }) => {
    const workflow = createHousePlanFromProductWorkflow(container)
    
    for (const product of products) {
      await workflow.run({
        input: {
          product,
          additional_data: additional_data as any,
        },
      })
    }
  }
)
