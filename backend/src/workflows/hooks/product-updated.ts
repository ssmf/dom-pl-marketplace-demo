import { updateProductsWorkflow } from "@medusajs/medusa/core-flows"
import { updateHousePlanFromProductWorkflow } from "../house_plan/update-house-plan-from-product"

updateProductsWorkflow.hooks.productsUpdated(
  async ({ products, additional_data }, { container }) => {
    const workflow = updateHousePlanFromProductWorkflow(container)
    
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
