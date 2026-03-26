import { createWorkflow, transform, when, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { createRemoteLinkStep } from "@medusajs/medusa/core-flows"
import { Modules } from "@medusajs/framework/utils"
import { HOUSE_PLAN_MODULE } from "../../../modules/house_plan"
import { createHousePlanStep } from "./steps/create-house-plan"

type WorkflowInput = {
  product: { id: string }
  additional_data?: {
    house_plan?: any
  }
}

export const createHousePlanFromProductWorkflow = createWorkflow(
  "create-house-plan-from-product",
  (input: WorkflowInput) => {
    const housePlanData = transform(
      { input },
      (data) => data.input.additional_data?.house_plan
    )

    const createdHousePlan = createHousePlanStep({ house_plan: housePlanData })

    when({ createdHousePlan }, ({ createdHousePlan }) => createdHousePlan !== null)
      .then(() => {
        createRemoteLinkStep([{
          [Modules.PRODUCT]: {
            product_id: input.product.id,
          },
          [HOUSE_PLAN_MODULE]: {
            house_plan_id: createdHousePlan.id,
          },
        }])
      })

    return new WorkflowResponse({
      house_plan: createdHousePlan,
    })
  }
)
